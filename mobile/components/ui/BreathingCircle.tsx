import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation } from "react-native-reanimated";
import { Text } from "./Text";
import { motion } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

export type BreathPattern = "breath-box" | "breath-478" | "breath-calm";
const PHASES = ["Breathe in", "Hold", "Breathe out", "Hold"] as const;

/**
 * Respiration guidée (Panic S09, Toolkit S20). Rythme lu dans les tokens.
 * Reduce Motion : pas de mise à l'échelle, seulement le texte de phase et le compte à rebours.
 * La phase est annoncée en live region pour suivre les yeux fermés.
 */
export function BreathingCircle({ pattern = "breath-calm", running = true, size = 220 }: { pattern?: BreathPattern; running?: boolean; size?: number }) {
  const { reduceMotion, colors } = useTheme();
  const durations = motion[pattern] as readonly number[];
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState(Math.round(durations[0] / 1000));
  const scale = useSharedValue(0.6);

  useEffect(() => {
    if (!running) return;
    let i = phase;
    // sauter les phases de durée 0
    while (durations[i] === 0) i = (i + 1) % 4;
    const ms = durations[i];
    setLeft(Math.round(ms / 1000));
    if (!reduceMotion) {
      const target = i === 0 ? 1 : i === 2 ? 0.6 : scale.value;
      scale.value = withTiming(target, { duration: ms, easing: Easing.inOut(Easing.sin) });
    }
    const tick = setInterval(() => setLeft((s) => Math.max(1, s - 1)), 1000);
    const next = setTimeout(() => setPhase((i + 1) % 4), ms);
    return () => { clearInterval(tick); clearTimeout(next); cancelAnimation(scale); };
  }, [phase, running, pattern, reduceMotion]);

  const current = durations[phase] === 0 ? PHASES[(phase + 1) % 4] : PHASES[phase];
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      {/* Animated.View ne passe pas par NativeWind : styles explicites depuis les tokens */}
      <Animated.View
        style={[
          { position: "absolute", width: size, height: size, borderRadius: size / 2, borderWidth: 2,
            borderColor: colors.accent, backgroundColor: colors.accent + "33" },
          reduceMotion ? { transform: [{ scale: 0.85 }] } : style,
        ]}
      />
      <Text variant="xl" accessibilityLiveRegion="polite">{current}</Text>
      <Text variant="2xl" tone="muted" style={{ fontVariant: ["tabular-nums"] }}>{left}</Text>
    </View>
  );
}
