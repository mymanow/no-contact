import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { LifeBuoy } from "lucide-react-native";
import { Text } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

/**
 * Le geste qui compte le plus : un tap, partout, sans confirmation.
 * - "fab" : flottant au-dessus de la tab bar (64px, cible bien au-delà du minimum).
 * - "hero" : pleine largeur sur Home et dans le check-in quand l'envie est forte.
 */
export function PanicButton({
  onPress, variant = "fab", label = "I want to reach out",
}: { onPress: () => void; variant?: "fab" | "hero"; label?: string }) {
  const { colors } = useTheme();
  const press = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress();
  };

  if (variant === "hero") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Opens tools to ride out the urge"
        onPress={press}
        className="flex-row items-center gap-4 rounded-xl bg-panic px-5 py-5 active:opacity-90"
      >
        <View className="h-12 w-12 items-center justify-center rounded-pill bg-bg/15">
          <LifeBuoy size={26} color={colors["on-panic"]} />
        </View>
        <View className="flex-1">
          <Text variant="lg" tone="on-panic">{label}</Text>
          <Text variant="sm" tone="on-panic" className="opacity-80">Tap before you text. 5 minutes is enough.</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Opens tools to ride out the urge"
      onPress={press}
      className={cn("h-16 w-16 items-center justify-center rounded-pill bg-panic active:opacity-90")}
      style={{ shadowColor: colors.panic, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 }}
    >
      <LifeBuoy size={28} color={colors["on-panic"]} />
    </Pressable>
  );
}
