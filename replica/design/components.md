# Composants — No Contact Tracker

Source : liste de composants de `replica/recon.md`. Code : `mobile/components/ui/`. Vitrine : route `/design` (captures : `design-dark.png`, `design-light.png`).

Règles communes
- Couleurs par **rôle** uniquement (`bg-surface`, `text-muted`…), jamais de hex dans un composant. Exception : SVG, icônes et `Animated.View` (non gérés par NativeWind) lisent `useTheme().colors`.
- Cible tactile **48 px minimum** ; Panic 64 px.
- Sombre par défaut, clair complet. Contraste vérifié par `contrast.py` sur les deux thèmes : 0 échec AA.
- Police : Inter (OFL), chiffres tabulaires pour les compteurs. Icônes : Lucide (ISC).
- Reduce Motion respecté partout où il y a animation.
- `maxFontSizeMultiplier` 1.6 (1.2 pour le compteur 72 px) : texte dynamique supporté sans casser les mises en page.
- Copie : brouillon en anglais, écrit pour cette app. Aucun libellé repris de l'original.

---

```
Text
  variants  xs 12/16 500, sm 14/20, base 16/24, lg 18/26 600, xl 22/28 700, 2xl 28/34 700, display 40/44 800, counter 72/76 800
  tones     default, muted, subtle, accent, danger, success, warning, panic, on-accent, on-panic
  a11y      xl / 2xl / display = role header ; tabular-nums sur display et counter
  used on   partout
```

```
Button
  variants  primary (accent), secondary (surface-2 + border), ghost, danger, panic
  sizes     sm 32px (hitSlop 8 → 48 effectif), md 48px, lg 56px
  states    default, pressed (opacity .8), focus-visible (outline 2px focus, web), disabled (.5), loading (spinner superposé, libellé gardé, largeur stable)
  tokens    radius md, font base/600, gap 8, icône 16/20
  a11y      role button, label = libellé, state disabled + busy ; haptique "selection" sur natif
  used on   S01–S05, S08, S12, S13, S25, S29
IconButton
  48×48, rond, label obligatoire (pas de libellé visible), tones default/accent/danger
```

```
Card / PressableCard
  variants  surface, raised (surface-2) ; PressableCard : selected (border 2px accent)
  tokens    radius lg, padding 16, border
  a11y      PressableCard = button avec label explicite, state selected si fourni
  used on   S07, S19, S21, S22, S24, S26
```

```
StreakCounter
  variants  ring (240px, anneau = progression vers l'objectif), compact (2xl + libellé)
  states    jour 0 (anneau vide), en cours, objectif atteint (anneau plein)
  tokens    anneau surface-2 / accent, stroke 14, chiffre counter 72
  a11y      un seul élément lu : "23 days no contact. Goal 60 days, 38 percent."
  used on   S07, S24, widget (could)
  note      le nombre de jours n'est jamais stocké : calculé depuis streak_attempts.started_at dans le fuseau du profil
```

```
MilestoneBadge
  states    earned (border accent, fond accent/15), locked (border, texte subtle)
  a11y      "7 day milestone, earned"
  used on   S07, S24
```

```
PanicButton
  variants  fab (64px rond, panic, ombre panic) ; hero (pleine largeur, titre + sous-titre)
  states    default, pressed ; aucune confirmation, aucun état désactivé (doit toujours marcher, hors ligne compris)
  tokens    bg panic, on-panic, radius pill / xl
  a11y      label "I want to reach out", hint "Opens tools to ride out the urge" ; haptique medium
  used on   fab sur toutes les tabs ; hero sur S07 et S08 quand urge ≥ 7
```

```
BreathingCircle
  patterns  breath-calm 4-0-6-0 (défaut), breath-box 4-4-4-4, breath-478 4-7-8-0 (durées dans tokens.motion)
  states    running, paused ; Reduce Motion → cercle fixe, texte + compte à rebours seulement
  tokens    border accent 2px, fond accent 20 %
  a11y      phase en live region ("Breathe in", "Hold", "Breathe out") : utilisable les yeux fermés
  used on   S09, S20
```

```
MoodPicker
  5 valeurs (Awful → Great), emoji + libellé + bordure couleur mood-n
  states    non sélectionné, sélectionné ; la couleur n'est jamais le seul signal
  a11y      radiogroup "How do you feel right now?", radio + checked
  used on   S08, S23
```

```
UrgeScale
  0–10, 11 segments de 48px de haut ; ≥ 7 passe en panic (sinon accent)
  a11y      un seul élément "adjustable" : balayer haut/bas = ±1 ; valeur lue "7 out of 10, strong"
  used on   S08, S25, Panic avant/après (S09)
  comportement  ≥ 7 au check-in → afficher PanicButton hero sous l'échelle
```

```
ChoiceList (QuestionCard)
  modes     single (radio), multiple (checkbox)
  states    default, selected (border 2 accent + coche), avec hint (2e ligne muted)
  a11y      radiogroup / list ; chaque option radio|checkbox + checked ; hint concaténé au label
  used on   S02, S03, S25
Chip
  états     default, selected (border accent, fond accent/15) ; 36px + hitSlop 6
  a11y      checkbox
  used on   S08 (déclencheurs), S10 (type), S19 (filtres)
ProgressBar
  6px, accent sur surface-2 ; a11y progressbar + valeur 0–100
  used on   S02, S22
```

```
TextField
  variants  single (48px), multiline (min 96px, align top)
  states    default (border-input), focus (2px focus), error (2px danger + message), disabled ; compteur si maxLength
  a11y      libellé visible au-dessus (jamais placeholder seul) ; erreur annoncée (live region polite), helper en hint
  used on   S02, S10, S12, S13, S15, S16, S23, S25
```

```
ChatBubble
  roles     user (accent, à droite), coach (surface-2, à gauche), system (centré, xs muted)
  status    not-sent ("Not sent · stays here"), error (bordure danger + "Tap to retry")
  skins     default, bubbly (coin pointé), minimal — brouillons S13 seulement
  a11y      lu comme "You: …" / "Coach: …" ; "Not sent." ajouté
  used on   S13, S14
TypingIndicator
  3 points animés (fixes si Reduce Motion) ; live region "Coach is typing"
Segmented
  2–4 options, fond surface-2, sélection surface + border
  a11y      tablist / tab + selected
  used on   S14 (ton du coach : Gentle / Straight talk), S11 (filtres), S24 (semaine / mois)
```

```
MediaTile
  types     screenshot, photo, video, voice, text — icône + durée en badge, légende en bas
  states    sans vignette (icône), avec vignette, flouté par défaut (on choisit de revoir), upload, erreur
  a11y      "Voice note, 0:42" ; ouverture en plein écran avec bouton fermer
  used on   S11, S12
```

```
ToolCard
  icône dans pastille accent/15, titre, meta "Calm · 2 min", cadenas si premium, étoile favori séparée
  a11y      deux cibles distinctes : ouvrir l'outil / ajouter-retirer des favoris (selected)
  used on   S09, S19
ArticleCard
  tag (xs accent uppercase), titre lg, "4 min · read"
  used on   S21, S07
```

```
PlanCard
  states    default, selected (border 2 accent, radio plein), badge optionnel ("Best value")
  a11y      radio + checked ; label = titre, prix, conditions, badge
  used on   S05
  note      prix réels injectés par RevenueCat (localisés) ; mentions légales d'auto-renouvellement sous les cartes
```

```
EmptyState
  icône subtle, titre, texte, action optionnelle ; bordure pointillée
  used on   S10, S11, S13, S14, S19 (favoris), S23
Toast
  tones     success, danger, neutral ; point de couleur + bordure (pas de couleur seule)
  a11y      role alert, live region polite ; disparaît après 4 s, jamais pour une erreur bloquante
  used on   global
ConfirmSheet
  feuille bas d'écran : poignée, titre, texte, contenu libre, action principale + "Not now"
  tones     primary, danger
  a11y      modal (accessibilityViewIsModal), fermeture voile / bouton / retour Android
  used on   S25 (Reset & Reflect), S12 (suppression), S29 (supprimer le compte)
```

À construire avec les écrans (spec seulement)
```
TabBar
  4 onglets : Today, Stay strong, Coach, Heal ; 64px ; icône + libellé ; PanicButton fab au-dessus à droite
  a11y      tablist ; badge non lu sur Coach
AudioRecorder
  états     idle, recording (timer + niveau), paused, playback ; limite 3 min
  a11y      bouton enregistrer / arrêter avec état ; durée annoncée
  used on   S12, S14 (voix)
AppLockGate
  écran flouté + Face ID / code au retour en premier plan, si activé
  used on   S11, S23, S13 (could, cf. features.csv)
CrisisBanner
  bandeau fixe en haut du coach quand safety_flag = crisis : numéros selon le pays, bouton appeler
  used on   S14, S18
```
