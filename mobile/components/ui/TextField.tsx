import { useState, type ComponentRef, type Ref } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { Text } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

type Props = Omit<TextInputProps, "ref"> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label: string;
  helper?: string;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
};

/** Champ texte / zone de texte. Le libellé est visible (pas de placeholder-only), l'erreur est annoncée. */
export function TextField({ label, helper, error, multiline, maxLength, value, onFocus, onBlur, ref, ...rest }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-1.5">
      <Text variant="sm" className="font-semibold">{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={error ?? helper}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        placeholderTextColor={colors["text-subtle"]}
        selectionColor={colors.accent}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        className={cn(
          "rounded-md border bg-surface px-4 text-base font-sans text-text",
          multiline ? "min-h-24 py-3" : "h-12",
          error ? "border-2 border-danger" : focused ? "border-2 border-focus" : "border-border-input"
        )}
        {...rest}
      />
      <View className="flex-row justify-between">
        {error ? (
          <Text variant="xs" tone="danger" accessibilityLiveRegion="polite">{error}</Text>
        ) : helper ? (
          <Text variant="xs" tone="muted">{helper}</Text>
        ) : <View />}
        {maxLength && typeof value === "string" ? (
          <Text variant="xs" tone="subtle">{value.length}/{maxLength}</Text>
        ) : null}
      </View>
    </View>
  );
}
