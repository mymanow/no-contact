import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Text } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

export type ChatRole = "user" | "coach" | "system";

/** Bulle de chat : coach (S14) et brouillon non envoyé (S13). `skin` change seulement l'habillage du brouillon. */
export function ChatBubble({
  role, text, status, skin = "default",
}: { role: ChatRole; text: string; status?: "not-sent" | "error"; skin?: "default" | "bubbly" | "minimal" }) {
  if (role === "system") {
    return (
      <View className="items-center px-6 py-2">
        <Text variant="xs" tone="muted" className="text-center">{text}</Text>
      </View>
    );
  }
  const mine = role === "user";
  return (
    <View
      accessible
      accessibilityLabel={`${mine ? "You" : "Coach"}: ${text}${status === "not-sent" ? ". Not sent." : ""}`}
      className={cn("max-w-[82%] gap-1", mine ? "self-end items-end" : "self-start items-start")}
    >
      <View
        className={cn(
          "px-4 py-3",
          skin === "minimal" ? "rounded-sm" : "rounded-lg",
          skin === "bubbly" && (mine ? "rounded-br-sm" : "rounded-bl-sm"),
          mine ? "bg-accent" : "bg-surface-2",
          status === "error" && "border-2 border-danger"
        )}
      >
        <Text variant="base" tone={mine ? "on-accent" : "default"}>{text}</Text>
      </View>
      {status === "not-sent" && <Text variant="xs" tone="subtle">Not sent · stays here</Text>}
      {status === "error" && <Text variant="xs" tone="danger">Couldn't send. Tap to retry.</Text>}
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const o = useSharedValue(0.3);
  const { reduceMotion, colors } = useTheme();
  useEffect(() => {
    if (reduceMotion) return;
    o.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1));
  }, [reduceMotion]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors["text-muted"] }, style]} />;
}

export function TypingIndicator() {
  return (
    <View accessibilityLabel="Coach is typing" accessibilityLiveRegion="polite" className="self-start flex-row gap-1.5 rounded-lg bg-surface-2 px-4 py-4">
      <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
    </View>
  );
}

/** Contrôle segmenté (ton du coach doux / cash, filtres). */
export function Segmented<T extends string>({
  options, value, onChange, label,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} className="flex-row rounded-md bg-surface-2 p-1">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            className={cn("h-10 flex-1 items-center justify-center rounded-sm", selected && "bg-surface border border-border")}
          >
            <Text variant="sm" tone={selected ? "default" : "muted"} className={selected ? "font-semibold" : undefined}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
