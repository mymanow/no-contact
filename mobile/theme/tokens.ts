// GÉNÉRÉ par scripts/build-tokens.mjs — ne pas éditer.
export const colorNames = ["bg","surface","surface-2","border","border-input","text","text-muted","text-subtle","accent","on-accent","panic","on-panic","danger","on-danger","success","warning","focus","mood-1","mood-2","mood-3","mood-4","mood-5"] as const;
export type ColorName = (typeof colorNames)[number];
export const themeVars = {
  dark: {
  "--color-bg": "14 16 20",
  "--color-surface": "22 26 33",
  "--color-surface-2": "31 36 45",
  "--color-border": "42 48 59",
  "--color-border-input": "111 121 136",
  "--color-text": "242 244 247",
  "--color-text-muted": "163 172 186",
  "--color-text-subtle": "138 147 162",
  "--color-accent": "142 155 255",
  "--color-on-accent": "14 16 20",
  "--color-panic": "255 143 107",
  "--color-on-panic": "14 16 20",
  "--color-danger": "255 107 107",
  "--color-on-danger": "14 16 20",
  "--color-success": "74 222 128",
  "--color-warning": "251 191 36",
  "--color-focus": "142 155 255",
  "--color-mood-1": "248 113 113",
  "--color-mood-2": "251 146 60",
  "--color-mood-3": "250 204 21",
  "--color-mood-4": "163 230 53",
  "--color-mood-5": "74 222 128"
},
  light: {
  "--color-bg": "255 255 255",
  "--color-surface": "245 246 248",
  "--color-surface-2": "236 238 242",
  "--color-border": "226 229 234",
  "--color-border-input": "122 131 145",
  "--color-text": "20 23 28",
  "--color-text-muted": "90 99 113",
  "--color-text-subtle": "99 107 120",
  "--color-accent": "79 91 213",
  "--color-on-accent": "255 255 255",
  "--color-panic": "194 65 12",
  "--color-on-panic": "255 255 255",
  "--color-danger": "198 47 47",
  "--color-on-danger": "255 255 255",
  "--color-success": "31 122 77",
  "--color-warning": "138 90 0",
  "--color-focus": "79 91 213",
  "--color-mood-1": "220 38 38",
  "--color-mood-2": "194 65 12",
  "--color-mood-3": "161 98 7",
  "--color-mood-4": "77 124 15",
  "--color-mood-5": "21 128 61"
},
} as const;
export const hex = {
  dark: {
  "bg": "#0e1014",
  "surface": "#161a21",
  "surface-2": "#1f242d",
  "border": "#2a303b",
  "border-input": "#6f7988",
  "text": "#f2f4f7",
  "text-muted": "#a3acba",
  "text-subtle": "#8a93a2",
  "accent": "#8e9bff",
  "on-accent": "#0e1014",
  "panic": "#ff8f6b",
  "on-panic": "#0e1014",
  "danger": "#ff6b6b",
  "on-danger": "#0e1014",
  "success": "#4ade80",
  "warning": "#fbbf24",
  "focus": "#8e9bff",
  "mood-1": "#f87171",
  "mood-2": "#fb923c",
  "mood-3": "#facc15",
  "mood-4": "#a3e635",
  "mood-5": "#4ade80"
},
  light: {
  "bg": "#ffffff",
  "surface": "#f5f6f8",
  "surface-2": "#eceef2",
  "border": "#e2e5ea",
  "border-input": "#7a8391",
  "text": "#14171c",
  "text-muted": "#5a6371",
  "text-subtle": "#636b78",
  "accent": "#4f5bd5",
  "on-accent": "#ffffff",
  "panic": "#c2410c",
  "on-panic": "#ffffff",
  "danger": "#c62f2f",
  "on-danger": "#ffffff",
  "success": "#1f7a4d",
  "warning": "#8a5a00",
  "focus": "#4f5bd5",
  "mood-1": "#dc2626",
  "mood-2": "#c2410c",
  "mood-3": "#a16207",
  "mood-4": "#4d7c0f",
  "mood-5": "#15803d"
},
} as const;
export const type = {
  "xs": {
    "size": 12,
    "line": 16,
    "weight": 500
  },
  "sm": {
    "size": 14,
    "line": 20,
    "weight": 400
  },
  "base": {
    "size": 16,
    "line": 24,
    "weight": 400
  },
  "lg": {
    "size": 18,
    "line": 26,
    "weight": 600
  },
  "xl": {
    "size": 22,
    "line": 28,
    "weight": 700
  },
  "2xl": {
    "size": 28,
    "line": 34,
    "weight": 700
  },
  "display": {
    "size": 40,
    "line": 44,
    "weight": 800
  },
  "counter": {
    "size": 72,
    "line": 76,
    "weight": 800
  }
} as const;
export const space = [0,2,4,6,8,12,16,20,24,28,32,40,48,56,64,80,96] as const;
export const radius = {"sm":8,"md":14,"lg":20,"xl":28,"pill":999} as const;
export const layout = {"screen-gutter":20,"tab-bar-height":64,"header-height":56,"touch-min":48,"panic-button":64,"max-content-width":560} as const;
export const motion = {
  "fast": "120ms",
  "base": "220ms",
  "slow": "400ms",
  "ease": "cubic-bezier(.2,.8,.2,1)",
  "breath-box": [
    4000,
    4000,
    4000,
    4000
  ],
  "breath-478": [
    4000,
    7000,
    8000,
    0
  ],
  "breath-calm": [
    4000,
    0,
    6000,
    0
  ],
  "_note": "Respiration : inspirer, tenir, expirer, tenir (ms). Respecter Reduce Motion : l'animation devient un fondu + compte texte."
} as const;
