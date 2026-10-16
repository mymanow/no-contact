// Les couleurs passent par des variables CSS (rôles), jamais par des hex dans les composants.
const dark = require("../replica/design/tokens.json");

const color = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;
const colors = Object.fromEntries(Object.keys(dark.color).map((k) => [k, color(k)]));
const px = (n) => `${n}px`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    colors: { transparent: "transparent", current: "currentColor", black: "#000", white: "#fff", ...colors },
    fontFamily: {
      sans: ["Inter_400Regular"],
      medium: ["Inter_500Medium"],
      semibold: ["Inter_600SemiBold"],
      bold: ["Inter_700Bold"],
      extrabold: ["Inter_800ExtraBold"],
      mono: ["ui-monospace", "Menlo", "monospace"],
    },
    fontSize: Object.fromEntries(
      Object.entries(dark.type).map(([k, t]) => [k, [px(t.size), { lineHeight: px(t.line) }]])
    ),
    spacing: { ...Object.fromEntries(dark.space.map((v) => [String(v / 4), px(v)])), px: "1px", gutter: px(dark.layout["screen-gutter"]) },
    borderRadius: { none: "0", ...Object.fromEntries(Object.entries(dark.radius).map(([k, v]) => [k, px(v)])), full: "9999px" },
    extend: {
      minHeight: { touch: px(dark.layout["touch-min"]) },
      minWidth: { touch: px(dark.layout["touch-min"]) },
      maxWidth: { content: px(dark.layout["max-content-width"]) },
    },
  },
  plugins: [],
};
