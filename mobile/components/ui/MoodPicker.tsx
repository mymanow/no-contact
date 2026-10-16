import { Pressable, View } from "react-native";
import { Text } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

const MOODS = [
  { value: 1, glyph: "😣", label: "Awful" },
  { value: 2, glyph: "😔", label: "Low" },
  { value: 3, glyph: "😐", label: "Okay" },
  { value: 4, glyph: "🙂", label: "Good" },
  { value: 5, glyph: "😌", label: "Great" },
] as const;

/** Groupe radio de 5 humeurs. La couleur n'est jamais le seul signal : emoji + libellé + bordure. */
export function MoodPicker({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="How do you feel right now?" className="flex-row justify-between gap-2">
      {MOODS.map((m) => {
        const selected = value === m.value;
        const tint = colors[`mood-${m.value}` as "mood-1"];
        return (
          <Pressable
            key={m.value}
            accessibilityRole="radio"
            accessibilityLabel={m.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(m.value)}
            className={cn("flex-1 items-center gap-1 rounded-md border-2 bg-surface py-3", !selected && "border-transparent")}
            style={selected ? { borderColor: tint } : undefined}
          >
            <Text style={{ fontSize: 28, lineHeight: 34 }}>{m.glyph}</Text>
            <Text variant="xs" tone={selected ? "default" : "muted"}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
