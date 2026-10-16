import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AccessibilityInfo, Platform, View, useColorScheme } from "react-native";
import { vars } from "nativewind";
import { hex, themeVars } from "./tokens";

export type ThemeName = "dark" | "light";
export type ThemePreference = ThemeName | "system";

type ThemeContextValue = {
  theme: ThemeName;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  /** Hex du thème actif, pour ce qui ne passe pas par className (SVG, icônes). */
  colors: (typeof hex)[ThemeName];
  reduceMotion: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const nativeVars = { dark: vars(themeVars.dark), light: vars(themeVars.light) };

export function ThemeProvider({ children, initial = "system" }: { children: ReactNode; initial?: ThemePreference }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(initial);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Sombre par défaut : usage nocturne, moments de crise. "system" ne passe en clair que si l'OS l'est.
  const theme: ThemeName = preference === "system" ? (system === "light" ? "light" : "dark") : preference;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({ theme, preference, setPreference, colors: hex[theme], reduceMotion }),
    [theme, preference, reduceMotion]
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, nativeVars[theme]]} className="bg-bg">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
