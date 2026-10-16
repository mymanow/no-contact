import { Pressable, View } from "react-native";
import { Check } from "lucide-react-native";
import { Text } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

export type ChoiceOption = { value: string; label: string; hint?: string };

/** Question d'onboarding / Reset & Reflect. single = radio, multiple = cases à cocher. */
export function ChoiceList({
  options, value, onChange, multiple, label,
}: {
  options: ChoiceOption[];
  value: string[];
  onChange: (v: string[]) => void;
  multiple?: boolean;
  label: string;
}) {
  const { colors } = useTheme();
  const toggle = (v: string) => {
    if (!multiple) return onChange([v]);
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };
  return (
    <View accessibilityRole={multiple ? "list" : "radiogroup"} accessibilityLabel={label} className="gap-2">
      {options.map((o) => {
        const selected = value.includes(o.value);
        return (
          <Pressable
            key={o.value}
            accessibilityRole={multiple ? "checkbox" : "radio"}
            accessibilityState={{ checked: selected }}
            accessibilityLabel={o.hint ? `${o.label}. ${o.hint}` : o.label}
            onPress={() => toggle(o.value)}
            className={cn(
              "min-h-touch flex-row items-center gap-3 rounded-md border bg-surface px-4 py-3",
              selected ? "border-2 border-accent" : "border-border"
            )}
          >
            <View className="flex-1">
              <Text variant="base" className={selected ? "font-semibold" : undefined}>{o.label}</Text>
              {o.hint && <Text variant="sm" tone="muted">{o.hint}</Text>}
            </View>
            <View
              className={cn(
                "h-6 w-6 items-center justify-center border-2",
                multiple ? "rounded-sm" : "rounded-pill",
                selected ? "border-accent bg-accent" : "border-border-input"
              )}
            >
              {selected && <Check size={14} color={colors["on-accent"]} strokeWidth={3} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!selected }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      className={cn("h-9 justify-center rounded-pill border px-4", selected ? "border-accent bg-accent/15" : "border-border bg-surface")}
    >
      <Text variant="sm" tone={selected ? "accent" : "muted"}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      className="h-1.5 overflow-hidden rounded-pill bg-surface-2"
    >
      <View className="h-full rounded-pill bg-accent" style={{ width: `${pct}%` }} />
    </View>
  );
}
