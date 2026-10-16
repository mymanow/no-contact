# Architecture : No Contact Tracker (reconstruction des features cœur de No Contact: Breakup Recovery)

Lit : `replica/recon.md`, `replica/features.csv`. SQL : `replica/schema.sql` (= migration `0001_init`, testé sur Postgres 16 avec stubs Supabase : pacte, rechute, unicité check-in, RLS inter-utilisateurs).

Principe : ta stack Manow (TypeScript, Supabase, Edge Functions, Claude API), adaptée au mobile natif. Un seul projet Supabase, pas de backend séparé.

## Stack

| couche | choix | pourquoi |
| --- | --- | --- |
| mobile | **Expo (React Native) + Expo Router + TypeScript** | une base iOS + Android, React que tu connais, builds EAS, OTA updates pour corriger sans review |
| styling | **NativeWind (Tailwind)**, tokens de `/replica-design` | même vocabulaire Tailwind que Manow |
| état / données | **TanStack Query** + persistance **MMKV** | cache offline, mutations rejouées au retour du réseau (check-in, panic) |
| base | **Supabase Postgres**, région selon le marché (US-East si cible US, Francfort si EU) | RLS, RPC, storage, auth au même endroit. Pas Singapour : les utilisateurs ne sont pas en Asie |
| accès | **RLS sur toutes les tables** + RPC `security definer` pour les transitions d'état | le client parle direct à PostgREST, la logique sensible (compteur, rechute) est atomique en SQL |
| auth | **Supabase Auth : anonyme d'abord**, puis lien Apple / Google / email OTP | onboarding sans friction jusqu'au paywall ; Sign in with Apple obligatoire si Google est proposé |
| paiements | **RevenueCat** au-dessus de StoreKit 2 / Play Billing | les abonnements numériques in-app doivent passer par l'IAP des stores (Stripe interdit ici) ; paywalls et A/B de prix sans release |
| IA | **Claude API via Edge Functions** (streaming SSE) | tu l'utilises déjà (`read-slip`), la clé reste serveur, quotas et garde-fous centralisés |
| vision / OCR | Claude (vision) dans l'Edge Function `analyze-conversation` | même pattern que `read-slip` : capture → texte structuré → analyse |
| voix (phase 2) | STT on-device (`expo-speech-recognition`), TTS serveur | moins cher et plus privé que l'audio brut envoyé au serveur |
| fichiers | **Supabase Storage**, buckets privés `vault` et `analysis-inputs`, URLs signées courtes | chemins `{user_id}/…` contrôlés par policy |
| notifications | **notifications locales** (rappel check-in, moments à risque) + Expo Push pour insights / milestones | le rappel quotidien marche hors ligne et sans infra |
| jobs | **pg_cron** → Edge Functions | même projet, pas de service de plus |
| email | Supabase Auth SMTP via **Resend** | OTP et emails de compte seulement |
| verrou app | `expo-local-authentication` (Face ID / code) | vault et journal = données très sensibles ; absent chez l'original |
| analytics | **PostHog** (EU cloud), sans SDK pub | l'original partage l'usage avec des tiers pub ; ici c'est l'argument inverse |
| erreurs | Sentry (Expo) | crash et perf |
| site | landing statique sur Cloudflare Pages | comme Manow ; plus tard via `/replica-launch` |

## Schéma

Tables : **29** (22 utilisateur, 5 contenu, 2 système). Accès : **RLS**.

Groupes :
- **Profil** : `profiles`, `relationship_stories`, `user_consents`, `push_tokens`
- **Pacte / compteur** : `pledges`, `streak_attempts`, `check_ins`, `milestones_earned`, `panic_sessions`
- **Contre-nostalgie** : `red_flags`, `vault_items`, `unsent_messages`
- **Coach IA** : `coach_threads`, `coach_messages`, `ai_usage_daily`, `conversation_analyses`
- **Se soigner** : `journal_entries`, `tools`, `tool_favorites`, `articles`, `article_reads`, `programs`, `program_steps`, `program_enrollments`, `step_completions`, `challenges`, `challenge_progress`
- **Monétisation** : `subscriptions`, `webhook_events`

Contraintes dures, côté base et pas côté UI :
- **un seul pacte actif par utilisateur** (index unique partiel `where status = 'active'`) ;
- **une seule tentative ouverte par pacte** (`where ended_at is null`), donc un double tap sur « j'ai craqué » ne peut pas créer deux compteurs ;
- **un check-in par jour local** (`unique (user_id, local_date)`) ;
- un milestone donné une fois par tentative (`unique (streak_attempt_id, days)`) ;
- idempotence offline : `client_id unique` sur `panic_sessions` et `coach_messages` ;
- webhooks : `webhook_events.id` = id d'événement RevenueCat, un rejeu est un conflit, ignoré.

Le compteur n'est **pas stocké** : jours = différence entre `streak_attempts.started_at` et maintenant, dans `profiles.timezone`. Rien à synchroniser, rien à corriger par cron.

Écritures réservées au serveur (RLS lecture seule pour le client) : `streak_attempts`, `milestones_earned`, `coach_messages`, `conversation_analyses`, `ai_usage_daily`, `subscriptions`. `pledges.status` n'est pas modifiable en direct.

## API

### RPC (Postgres, appelées depuis l'app)

| appel | fait | qui | entrée | sortie | flow |
| --- | --- | --- | --- | --- | --- |
| `rpc start_pledge` | abandonne le pacte actif, crée pacte + tentative ouverte, atomique | connecté | goal_days, rules, started_at (≤ 365 j passé) | pledge_id | F01 |
| `rpc record_relapse` | ferme la tentative ouverte (relapse_kind, reflection), en ouvre une nouvelle | connecté | kind, reflection, happened_at | nouvelle tentative | F08 |
| `rpc has_premium` | droit premium courant | connecté | — | bool | F10, gating UI |
| `rpc home_summary` *(à écrire, milestone 1)* | compteur, check-in du jour, milestone suivant, défi actif en un appel | connecté | tz | json | F02, S07 |

### CRUD direct (PostgREST sous RLS)

| table | opérations | écrans | flow |
| --- | --- | --- | --- |
| `relationship_stories` | upsert | S02, S15 | F01 |
| `check_ins` | upsert sur (user_id, local_date) | S08 | F02 |
| `panic_sessions` | insert (client_id), update fin | S09 | F03 |
| `red_flags` | CRUD, réordonner | S10 | F05 |
| `vault_items` + Storage `vault/{uid}/…` | CRUD, upload signé | S11, S12 | F05 |
| `unsent_messages` | CRUD | S13 | F04 |
| `journal_entries` | CRUD | S23 | F09 |
| `tools`, `articles`, `programs`, `program_steps`, `challenges` | select | S19–S22, S26 | F09 |
| `tool_favorites`, `article_reads`, `program_enrollments`, `step_completions`, `challenge_progress` | insert / delete | idem | F09 |
| `profiles` | update (tz, rappel, ton, verrou) | S29 | — |
| `user_consents` | insert | S01, S29 | F01 |

### Edge Functions

| méthode chemin | fait | qui | entrée | sortie | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /coach-chat` | prompt = profil + histoire + `coach_summary` + 20 derniers messages + ton ; classif sécurité avant et après ; stream SSE ; écrit les messages + `ai_usage_daily` | connecté ; premium, sinon N messages gratuits par jour | thread_id?, client_id, text, tone, origin | stream de tokens, puis message_id, safety_flag | F06, F03, F04 |
| `POST /analyze-conversation` | capture (Storage) ou texte → extraction → analyse structurée (patterns, manipulation, sous-texte, niveau de confiance) ; supprime l'input sauf si gardé | premium | source, storage_path \| text | analysis_id, result | F07 |
| `POST /revenuecat-webhook` | vérifie l'en-tête d'auth, insère `webhook_events` (on conflict do nothing), upsert `subscriptions` | RevenueCat seul | événement RC | 200 | F10 |
| `POST /delete-account` | supprime les objets Storage puis `auth.users` (cascade) | connecté | — | 204 | S29 (obligatoire App Store) |
| `POST /export-data` *(should)* | JSON de toutes les données + liens signés | connecté | — | url | S29, RGPD |
| `POST /link-identity` | rien : `supabase.auth.linkIdentity` côté client | — | — | — | F01 |

Webhooks entrants : RevenueCat. Sortants : aucun.

### Jobs (pg_cron)

| job | horaire | fait |
| --- | --- | --- |
| `milestones` | toutes les heures | pour les tentatives ouvertes qui franchissent 1/3/7/14/30/60/90… jours dans leur fuseau : insert `milestones_earned` + push |
| `coach-summarize` | toutes les heures | threads inactifs depuis 30 min et non résumés : met à jour `relationship_stories.coach_summary` (mémoire longue, prompt court) |
| `weekly-insights` | lundi, heure locale ~9 h (sélection par tz) | stats de la semaine (humeur, envies, panics résistés) + un insight → push |
| `analysis-cleanup` | quotidien | supprime les inputs d'analyse non gardés de plus de 24 h |
| `subscription-expire` | quotidien | passe en `expired` ce que RevenueCat n'a pas notifié (filet de sécurité) |

Le rappel de check-in est une **notification locale** reprogrammée par l'app : pas de job.

## Les parties qui mordent

- **Fuseaux horaires** : le « jour » est local. `check_ins.local_date` calculé côté client avec la tz IANA, `profiles.timezone` mis à jour à chaque ouverture. Les milestones utilisent la tz du profil. Un voyage peut faire gagner ou perdre quelques heures, jamais un jour de compteur, puisqu'on part de `started_at`.
- **Idempotence** : les webhooks RevenueCat arrivent en double → `webhook_events`. Les mutations offline rejouées → `client_id unique`. Le check-in est un upsert.
- **Courses** : double tap sur rechute ou nouveau pacte → `for update` + index partiels uniques. Deux appareils en même temps → même résultat.
- **Coût IA** : quota par jour dans `ai_usage_daily`. Plafond sur le contexte (résumé + 20 messages). Modèle léger pour la classif sécurité et le résumé. Le coût par utilisateur payant est à suivre dès le jour 1.
- **Sécurité et santé mentale** : détection crise / automutilation / violence avant chaque réponse. En cas de crise : message fixe + numéros d'urgence selon le pays + pas de réponse générative libre. Disclaimers « coach, pas thérapeute ». Section abus avec ressources. C'est le point le plus important pour la review App Store et pour les utilisateurs.
- **Review App Store** : pas d'allégation thérapeutique, IAP obligatoire, suppression de compte in-app, Sign in with Apple, permissions photos/micro justifiées, contenu 16+ cohérent.
- **Données sensibles et RGPD** : histoire, journal, captures avec les messages d'un tiers (l'ex). Consentement explicite `sensitive_data` + `ai_processing`. Anthropic listée comme sous-traitant dans la politique de confidentialité (le trou trouvé sur les CGU Manow). Export + suppression. Pas de SDK pub.
- **Fichiers** : vault 100 Mo max par fichier, vidéo compressée côté client et limitée à ~60 s, images en JPEG/HEIC ≤ 4 Mo, captures d'analyse 20 Mo. Upload résumable pour les vidéos.
- **Offline** : la Panic Room doit marcher sans réseau. Outils respiration / grounding, red flags et affirmations sont en cache local ; panic et check-in sont mis en file. Le coach indique clairement qu'il est hors ligne.
- **Utilisateurs anonymes** : un utilisateur qui désinstalle avant de lier un compte perd ses données. Proposer le lien du compte juste après le paywall et au 3e jour. Les anonymes sans activité depuis 90 jours sont purgés.
- **Abonnements** : RevenueCat est la source de vérité. `has_premium()` sert au gating serveur (coach, analyzer), le SDK RevenueCat au gating UI. Les restaurations d'achat passent par RevenueCat.
- **Contenu** : articles, outils, programmes, affirmations sont **les tiens**. Tables multilingues (`jsonb` par locale), ce qui ouvre la voie au FR / TH alors que l'original est EN seul.

## Ordre de build

1. **Tranche verticale** (moche, de bout en bout)
   - Écrans : S01 → S02 (3 questions) → S04 → S07 (compteur) → S08 (check-in) → S09 (respiration seule) → S25 (rechute)
   - Tables : `profiles`, `relationship_stories`, `pledges`, `streak_attempts`, `check_ins`, `panic_sessions`
   - Routes : auth anonyme, `start_pledge`, `record_relapse`, `home_summary`, upsert check-in
   - Preuve : installer → s'engager → le compteur tourne → check-in → craquer → nouveau compteur avec historique.
2. **Must-haves**
   - Onboarding : S02 complet, S03 règles, S06 notifs locales, lien Apple / Google / email
   - Paywall : S05 + RevenueCat + `/revenuecat-webhook` + `subscriptions`
   - Contre-nostalgie : S10, S11–S12 (Storage vault), S13
   - Coach : S14–S15, `/coach-chat`, garde-fous de crise, quotas, `coach-summarize`
   - Compte : S29 minimal avec `/delete-account` (exigé par Apple, donc must ici)
   - Panic complet : respiration, rappels red flags, affirmations, offline
3. **Should-haves** : S24 progrès + `milestones` + `weekly-insights` ; S26 défis ; S19–S20 toolkit ; S21 learn ; S23 journal ; S22 programmes ; S16–S17 `/analyze-conversation` ; S18 ; voix du coach ; skins S13 ; export de données.
4. **Could-haves** : widget compteur, verrou app (à remonter si l'entrepreneur le confirme), FR / TH, vidéos de distraction, visualisations, growth feed.
5. **Fixes de `/replica-entrepreneur`** : à insérer une fois les avis lus.
