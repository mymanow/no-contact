import { Pressable, View } from "react-native";
import { Text } from "./Text";
import { cn } from "./cn";

/**
 * Intensité de l'envie 0–10. Segments tactiles plutôt qu'un slider continu :
 * plus précis au pouce, et "adjustable" pour VoiceOver / TalkBack (balayer haut/bas).
 */
export function UrgeScale({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(0, Math.min(10, v)));
  const level = value >= 7 ? "strong" : value >= 4 ? "medium" : "low";
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Urge to contact them"
      accessibilityValue={{ min: 0, max: 10, now: value, text: `${value} out of 10, ${level}` }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === "increment" ? 1 : -1))}
      className="gap-2"
    >
      <View className="flex-row gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <Pressable
            key={i}
            onPress={() => set(i)}
            importantForAccessibility="no"
            className={cn(
              "h-12 flex-1 items-center justify-center rounded-sm",
              i <= value ? (value >= 7 ? "bg-panic" : "bg-accent") : "bg-surface-2"
            )}
          >
            <Text variant="xs" tone={i <= value ? (value >= 7 ? "on-panic" : "on-accent") : "subtle"}>{i}</Text>
          </Pressable>
        ))}
      </View>
      <View className="flex-row justify-between">
        <Text variant="xs" tone="subtle">No urge</Text>
        <Text variant="xs" tone="subtle">Can't stop thinking about it</Text>
      </View>
    </View>
  );
}
