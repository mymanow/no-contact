import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Text } from "./Text";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  days: number;
  goalDays: number;
  /** "ring" : Home. "compact" : en-têtes, widget. */
  size?: "ring" | "compact";
  label?: string;
};

/** Compteur de jours sans contact. Le chiffre est la donnée ; l'anneau montre la progression vers l'objectif. */
export function StreakCounter({ days, goalDays, size = "ring", label = "days no contact" }: Props) {
  const { colors } = useTheme();
  const progress = Math.max(0, Math.min(1, goalDays > 0 ? days / goalDays : 0));
  const a11y = `${days} ${days === 1 ? "day" : "days"} no contact. Goal ${goalDays} days, ${Math.round(progress * 100)} percent.`;

  if (size === "compact") {
    return (
      <View accessible accessibilityLabel={a11y} className="flex-row items-baseline gap-2">
        <Text variant="2xl" style={{ fontVariant: ["tabular-nums"] }}>{days}</Text>
        <Text variant="sm" tone="muted">{label}</Text>
      </View>
    );
  }

  const box = 240;
  const stroke = 14;
  const r = (box - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={a11y} className="items-center justify-center" style={{ width: box, height: box }}>
      <Svg width={box} height={box} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={box / 2} cy={box / 2} r={r} stroke={colors["surface-2"]} strokeWidth={stroke} fill="none" />
        <Circle
          cx={box / 2} cy={box / 2} r={r}
          stroke={colors.accent} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={`${c} ${c}`} strokeDashoffset={c * (1 - progress)}
        />
      </Svg>
      <Text variant="counter">{days}</Text>
      <Text variant="sm" tone="muted">{label}</Text>
      <Text variant="xs" tone="subtle" className="mt-1">goal {goalDays}</Text>
    </View>
  );
}
