// Génère global.css, theme/tokens.ts et replica/design/tokens.css depuis replica/design/tokens*.json.
// Source de vérité = les JSON. Ne pas éditer les fichiers générés à la main.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const designDir = join(root, "..", "replica", "design");
const dark = JSON.parse(readFileSync(join(designDir, "tokens.json"), "utf8"));
const light = JSON.parse(readFileSync(join(designDir, "tokens.light.json"), "utf8"));

const rgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
};
const vars = (colors) =>
  Object.fromEntries(Object.entries(colors).map(([k, v]) => [`--color-${k}`, rgb(v)]));
const block = (sel, v) =>
  `${sel} {\n${Object.entries(v).map(([k, val]) => `  ${k}: ${val};`).join("\n")}\n}\n`;

const header = "/* GÉNÉRÉ par mobile/scripts/build-tokens.mjs depuis replica/design/tokens*.json — ne pas éditer. */\n";
// Sombre par défaut. Le thème actif est appliqué par ThemeProvider (vars() NativeWind sur natif, classe .light sur web).
const cssVars = block(":root", vars(dark.color)) + "\n" + block(".light", vars(light.color));

writeFileSync(join(root, "global.css"), header + "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n" + cssVars);
writeFileSync(join(designDir, "tokens.css"), header + cssVars);

const ts = `// GÉNÉRÉ par scripts/build-tokens.mjs — ne pas éditer.
export const colorNames = ${JSON.stringify(Object.keys(dark.color))} as const;
export type ColorName = (typeof colorNames)[number];
export const themeVars = {
  dark: ${JSON.stringify(vars(dark.color), null, 2)},
  light: ${JSON.stringify(vars(light.color), null, 2)},
} as const;
export const hex = {
  dark: ${JSON.stringify(dark.color, null, 2)},
  light: ${JSON.stringify(light.color, null, 2)},
} as const;
export const type = ${JSON.stringify(dark.type, null, 2)} as const;
export const space = ${JSON.stringify(dark.space)} as const;
export const radius = ${JSON.stringify(dark.radius)} as const;
export const layout = ${JSON.stringify(dark.layout)} as const;
export const motion = ${JSON.stringify(dark.motion, null, 2)} as const;
`;
writeFileSync(join(root, "theme", "tokens.ts"), ts);
console.log("tokens: global.css, theme/tokens.ts, replica/design/tokens.css");
