# No Contact Tracker

App mobile (iOS + Android) de suivi du no contact après une rupture.

## Structure

- `replica/recon.md` — carte de recon (écrans, flows, modèle de données)
- `replica/features.csv` — matrice de features
- `replica/architecture.md` — stack, API, jobs, ordre de build
- `replica/schema.sql` — migration Supabase initiale (`0001_init`)
- `replica/design/` — tokens (sombre + clair), specs composants, rapports de contraste, captures du design system
- `mobile/` — app Expo (SDK 58, Expo Router, NativeWind)

## Mobile

```bash
cd mobile
npm install
npm run tokens      # régénère global.css + theme/tokens.ts depuis replica/design/tokens*.json
npm run typecheck
npm run contrast    # WCAG AA sur les deux thèmes
npx expo start      # /design = vitrine du design system
```

Les tokens JSON sont la source de vérité : ne pas éditer `global.css` ni `theme/tokens.ts` à la main.
