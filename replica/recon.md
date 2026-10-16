# Recon map : No Contact: Breakup Recovery — gonocontact.com (iOS, Android annoncé)

Scope : la boucle cœur (pacte + compteur, check-in, Panic Room, contre-nostalgie, brouillons non envoyés, coach IA) + paywall. Programmes, growth feed, communauté = phase 2.
Pour : ton app No Contact Tracker, à vendre (grand public, abonnement).
Date : 2026-10-16
Éditeur : Ember Labs Ltd (dev : deserve.studio). Site Framer.

> Limite de cette recon : uniquement sources publiques. Les captures App Store n'ont pas de texte lisible, donc les écrans sont **inférés** des descriptions, du changelog et de la FAQ. Pour passer en confiance haute : installe l'app, fais l'onboarding jusqu'au paywall et dépose les captures dans `replica/screens/` (S01…S29). Leurs conditions d'utilisation pointent vers l'EULA Apple standard, qui n'interdit pas d'étudier l'app pour un produit concurrent.

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | site marketing | https://gonocontact.com/ | features, FAQ (5 Q), coach nommé "Sam", "No-BS Mode", "Ick List", "Text Your Ex (But Don't)" |
| 2 | page pricing | https://gonocontact.com/pricing | un seul plan "No contact essentials" à 19,99 $ (période non dite) |
| 3 | fiche App Store US | https://apps.apple.com/us/app/no-contact-breakup-recovery/id6746055015 | 4,7★ / 2,3K notes, Health & Fitness, 16+, 341 Mo, EN seul, 10 IAP, description complète, privacy labels |
| 4 | changelog App Store | (même fiche, Version History) | 1.0.4 → 1.0.40, juin 2025 → août 2026 |
| 5 | blog | https://gonocontact.com/blog | 8 articles SEO juin–juil. 2026, pas de changelog produit |
| 6 | support | https://discord.gg/cfXsSFJUVg | pas de help center, support et "communauté" sur Discord |
| 7 | Google Play | — | annoncé sur le site, mais les liens Android pointent vers l'EULA Apple (cassés). Aucune fiche Play d'Ember Labs trouvée |
| 8 | (à faire) ton propre compte | — | onboarding, paywall, états vides — la source qui manque |

Attention : `com.nocontacttracker.app` (BlueStacks) est une **autre** app (VexaLabs), pas celle-ci. Elle sert de concurrent secondaire : Trigger tracker, Unsent Letters, 5-4-3-2-1, "Your Wins".

## Core loop

Chaque jour : garder le compteur de jours sans contact, et quand l'envie de contacter l'ex monte, un tap vers la Panic Room / le coach IA au lieu d'envoyer le message.

## Écrans (inférés)

| ID | écran | accès | but | composants clés | états |
| --- | --- | --- | --- | --- | --- |
| S01 | Welcome | lancement | promesse, CTA démarrer | hero, CTA, lien login | — |
| S02 | Questionnaire "ton histoire" | onboarding | type de rupture (rupture, toxique, divorce, situationship, on-off), durée, qui a quitté, ancienne fréquence de contact → personnalise le coach | question à choix, progress bar | partiel, retour |
| S03 | Règles & durée du no contact | onboarding / réglages | règles perso (bloquer, pas de stalking réseaux, exceptions enfants/travail), objectif 30/60/90 j | toggles, picker durée | défaut, perso (v1.0.23) |
| S04 | Pacte | onboarding | signer l'engagement, date de début | texte du pacte, signature / hold-to-commit | — |
| S05 | Paywall | fin onboarding + features verrouillées | essai gratuit, hebdo / mensuel / trimestriel / annuel | plan cards, toggle essai, restore, legal | plusieurs variantes de prix (A/B probable) |
| S06 | Permission notifications | onboarding | rappels check-in, tâches, moments à risque | prompt pré-permission | accepté, refusé |
| S07 | Home | onglet 1 | compteur de jours, check-in du jour, défis, bouton Panic | streak ring, cards, FAB panic | jour 0, en cours, milestone (v1.0.26 redesign) |
| S08 | Check-in quotidien | Home / notif | humeur, intensité de l'envie, note | mood picker, slider, textarea | fait, pas fait (redesign v1.0.33) |
| S09 | Panic Room / Reality Check | bouton 1 tap partout | désamorcer l'envie : respiration guidée, affirmations, vidéos de distraction, bouton "rescue", rappel des red flags | grandes actions, timer respiration, player | en cours, terminé |
| S10 | Red flags / Ick List | onglet Stay strong | lister red flags, dealbreakers, raisons de la rupture | liste, ajout rapide | vide, rempli |
| S11 | Evidence Vault | onglet Stay strong | captures, photos, vidéos, notes vocales comme rappels | grille média, filtres | vide, rempli (redesign v1.0.31) |
| S12 | Ajout / détail d'une preuve | S11 | upload, légende, tag | picker média, recorder audio | upload, erreur |
| S13 | Text Your Ex (But Don't) | S07 / S09 | écrire le message dans un faux chat, rien n'est envoyé | chat simulator, skins (v1.0.28) | brouillon, "non envoyé" |
| S14 | Coach IA (Sam / Kai) | onglet coach | chat + voix, mode doux / tough love ("No-BS Mode") | chat, toggle mode, micro | vide, typing, erreur réseau, quota |
| S15 | Mon histoire (contexte du coach) | S14 / réglages | ce que le coach sait de toi, éditable | formulaire | — |
| S16 | Conversation Analyzer | onglet Understand | importer capture, coller un message ou un historique | upload, textarea, import fichier | (v1.0.26) |
| S17 | Résultat d'analyse | S16 | patterns, sous-texte, signaux de manipulation | sections, tags | chargement, erreur OCR |
| S18 | Abuse Awareness | onglet Understand | manipulation, contrôle coercitif, ressources | articles, liens d'aide | — |
| S19 | Toolkit | onglet Heal | outils par besoin (grounding, respiration, tension), favoris | catégories, cards, ★ | favoris vides (v1.0.40) |
| S20 | Lecteur d'outil | S19 / S09 | exercice guidé (respiration, somatique) | timer, animation, audio | en cours, fini |
| S21 | Learn + article | onglet Heal | articles courts (trauma bond, deuil non linéaire), reco selon tes patterns | liste, lecteur | lu / non lu (v1.0.40) |
| S22 | Programmes / roadmap | Home | parcours structurés par étape de récupération, tâches du jour | étapes, tâches, progress | verrouillé, en cours |
| S23 | Journal | onglet Heal | journal guidé avec prompts | prompt, éditeur, historique | vide, rempli |
| S24 | Progrès & insights | Home / onglet | historique streak, humeur, milestones, insights hebdo | graphe, timeline, badges | 1re semaine, longue période |
| S25 | Reset & Reflect | Home (j'ai craqué) | déclarer une rechute, réfléchir, relancer le compteur en gardant l'historique | questions, confirmation | — |
| S26 | Défis | Home | challenges (v1.0.26) | cards, progress | dispo, en cours, fini |
| S27 | Growth feed | onglet | fil de contenu positif pour remplacer les réseaux | feed vertical | phase 2 |
| S28 | Visualisation | Heal | sessions audio pour répéter les moments durs | player audio | phase 2 |
| S29 | Réglages / compte | profil | abonnement, notifs, règles, confidentialité, suppression des données | liste | — |

## Flows

```
F01 Démarrer le no contact
    S01 -> S02 (6–10 questions) -> S03 -> S04 -> S05 -> S06 -> S07
    happy path : ~15 taps (à mesurer sur l'app réelle)
    edge : ferme le paywall (accès free limité ?), refuse les notifs, date de début dans le passé

F02 Check-in quotidien
    notif -> S08 -> S07
    happy path : 3–4 taps
    edge : check-in oublié hier, envie forte → proposer S09

F03 L'envie monte (le moment qui fait payer)
    n'importe où -> [Panic] -> S09 -> S20 ou S10/S11 (rappels) -> S07
    happy path : 1 tap pour entrer
    edge : la nuit, hors ligne (doit marcher sans réseau), envie toujours là → coach S14

F04 Écrire au lieu d'envoyer
    S07/S09 -> S13 -> écrire -> "pas envoyé" -> option parler au coach S14
    edge : brouillons sauvegardés, suppression

F05 Constituer la contre-nostalgie
    S10 ajout red flag ; S11 -> S12 upload capture / vocal
    edge : gros fichiers, permission photos refusée, confidentialité (verrou app ?)

F06 Parler au coach
    S14 -> choisir mode -> chat / voix
    edge : propos de crise ou d'abus → ressources d'urgence, quota messages, pas de réseau

F07 Analyser une conversation
    S16 -> upload capture -> S17
    edge : capture illisible, autre langue, historique long

F08 Rechute
    S07 -> "j'ai craqué" -> S25 -> nouveau compteur, historique conservé dans S24

F09 Se soigner
    S19 -> S20 ; S21 -> article ; S23 journal ; S22 tâche du jour

F10 Abonnement
    S05 essai -> achat ; S29 restaurer / gérer
```

## Composants

| composant | variantes | états | utilisé sur |
| --- | --- | --- | --- |
| Button | primary, secondary, ghost, danger | default, pressed, disabled, loading | partout |
| Panic FAB | flottant, plein écran | idle, pressed | S07, S10–S24 |
| Streak counter | ring, grand chiffre, mini | jour 0, en cours, milestone | S07, S24 |
| Mood picker | emojis / échelle 5 | sélection | S08 |
| Urge slider | 0–10 | — | S08, S25 |
| Question card | choix unique, multiple, texte | sélectionné | S02, S25 |
| Progress bar | onboarding, programme | — | S02, S22 |
| Chat bubble | user, coach, système | typing, erreur | S13, S14 |
| Chat skin | plusieurs thèmes de messagerie | — | S13 |
| Mode toggle | doux / tough love | — | S14 |
| Media grid | photo, vidéo, audio, capture | upload, erreur | S11 |
| Audio recorder | — | rec, pause, lecture | S12, S14 |
| Breathing timer | inspir/expir animés | en cours, fini | S09, S20 |
| Tool card | par catégorie | favori | S19 |
| Article card / reader | — | lu, non lu | S21 |
| Plan card (paywall) | hebdo, mensuel, trimestriel, annuel | sélectionné, badge "best value" | S05 |
| Milestone badge | 1, 3, 7, 14, 30, 60, 90 j (supposé) | gagné, verrouillé | S07, S24 |
| Bottom tab bar | 4–5 onglets | actif | global |
| Toast / snackbar | succès, erreur | — | global |
| Bottom sheet / modal | confirmation, reset | — | S25, S12 |

## Modèle de données inféré

```
User            id, email, created_at, locale, notif_prefs
                evidence: privacy label "email", "user ID"          confidence: high
RelationshipStory user_id, breakup_type, duration, who_ended, ended_at, ex_nickname, notes
                evidence: "coach learns your story", divorce/toxic/on-off ciblés   confidence: medium
NoContactPledge id, user_id, start_at, goal_days, rules (json), status (active|broken|completed)
                evidence: v1.0.23 règles & durée perso, "pledge"     confidence: high
StreakAttempt   id, pledge_id, start_at, end_at, end_reason (relapse|completed), reflection (json)
                evidence: Reset & Reflect garde l'historique          confidence: high
CheckIn         id, user_id, date, mood, urge_level, note
                evidence: "check in daily, log your mood"             confidence: high
RedFlag         id, user_id, text, kind (red_flag|dealbreaker|ick|reason)
                evidence: Ick List, red flags & dealbreakers          confidence: high
VaultItem       id, user_id, type (screenshot|photo|video|voice), storage_path, caption, created_at
                evidence: Evidence Vault, privacy "photos or videos"  confidence: high
UnsentMessage   id, user_id, body, skin, created_at
                evidence: Text Your Ex (But Don't)                    confidence: high
CoachThread     id, user_id, mode (gentle|tough), created_at
CoachMessage    id, thread_id, role, content, audio_path?
                evidence: AI chat + voice coaching                     confidence: high
Analysis        id, user_id, source (screenshot|paste|import), input_ref, result (json)
                evidence: Conversation Analyzer                        confidence: medium
PanicSession    id, user_id, started_at, tool_used, outcome
                evidence: guess (sert aux insights)                    confidence: guess
Tool / ToolFavorite   id, category, type, content_ref ; user_id, tool_id
                evidence: Toolkit + favoris v1.0.40                   confidence: high
Article / ArticleRead id, title, tags ; user_id, article_id, read_at
                evidence: Learn                                        confidence: high
Program / ProgramEnrollment / Task   étapes par phase de récupération
                evidence: "structured programs", "roadmap", "task notifications"   confidence: medium
JournalEntry    id, user_id, prompt, body, created_at                  confidence: high
Challenge / ChallengeProgress                                         confidence: medium
Subscription    user_id, product_id, period, status, trial_end (via RevenueCat ou équivalent)
                evidence: 10 IAP                                       confidence: high
```

Relations : User 1-1 RelationshipStory, User 1-n NoContactPledge 1-n StreakAttempt, User 1-n CheckIn / RedFlag / VaultItem / UnsentMessage / JournalEntry / Analysis, User 1-n CoachThread 1-n CoachMessage, Program 1-n Task.

## Feature matrix

Voir `features.csv`. Must : 17 (dont 1 ajout : ressources de crise), should : 14, could : 7 (dont 3 ajouts), skip : 6. `parity.py` compte 34 features de l'original, 16 must-haves.

## Hors scope (ne peut pas / ne doit pas être cloné)

- Leurs contenus : articles Learn, affirmations, vidéos de distraction, audios de visualisation, textes des programmes → à écrire toi-même ou à licencier.
- Les noms propres : "Panic Room", "Evidence Vault", "Text Your Ex (But Don't)", "No-BS Mode", coach "Sam"/"Kai", "Ick List" → renommer au stade brand.
- La communauté : c'est leur Discord et ses membres, pas une feature.
- Le faux bloc presse "What the press (probably) would say" et la stat "60 % en 30 jours" sans source → ne pas reproduire.
- Le positionnement "AI therapist" de la fiche App Store → à éviter : risque de rejet App Store et réglementaire ; parle de "coach", avec ressources de crise.
- Leur tracking publicitaire (usage data partagée à des tiers) → c'est au contraire un angle de différenciation.

## Taille

Écrans 29 (dont ~18 pour la boucle cœur), flows 10, entités ~17.
Parties difficiles :
1. **Coach IA** avec mémoire de l'histoire, deux tons, voix, garde-fous (détection de crise / abus, coût par message et quotas).
2. **Conversation Analyzer** : OCR / vision sur captures + parsing d'exports WhatsApp/iMessage/LINE, et des résultats qui ne surinterprètent pas.
3. **Abonnements** multi-périodes avec essai et paywall testable (RevenueCat), sur iOS et Android.
Aussi : coffre média privé (stockage chiffré, verrou app), notifications locales intelligentes, Panic Room utilisable hors ligne.

Taille : **M** pour la boucle cœur (quelques semaines), **L** pour la parité complète (programmes, contenus, analyzer).
