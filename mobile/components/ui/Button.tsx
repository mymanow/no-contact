import type { ComponentType, ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import { Text, type TextTone } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "panic";
export type ButtonSize = "sm" | "md" | "lg";
type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const base = "flex-row items-center justify-center rounded-md gap-2";
const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-accent",
  secondary: "bg-surface-2 border border-border",
  ghost: "bg-transparent",
  danger: "bg-danger",
  panic: "bg-panic",
};
const textTone: Record<ButtonVariant, TextTone> = {
  primary: "on-accent",
  secondary: "default",
  ghost: "accent",
  danger: "on-accent",
  panic: "on-panic",
};
const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3",       // 32
  md: "h-12 px-5",      // 48 = cible tactile min
  lg: "h-14 px-6",      // 56
};

export type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: Icon;
  full?: boolean;
  haptic?: boolean;
  className?: string;
  trailing?: ReactNode;
};

export function Button({
  label, variant = "primary", size = "md", loading, disabled, icon: IconCmp, full, haptic = true, className, trailing, onPress, ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const fg = { primary: colors["on-accent"], secondary: colors.text, ghost: colors.accent, danger: colors["on-danger"], panic: colors["on-panic"] }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      hitSlop={size === "sm" ? 8 : 0}
      disabled={isDisabled}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      className={cn(
        base, variantClass[variant], sizeClass[size], full && "self-stretch",
        isDisabled && "opacity-50",
        "active:opacity-80 web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-offset-2 web:focus-visible:outline-focus",
        className
      )}
      {...rest}
    >
      {IconCmp && <IconCmp size={size === "sm" ? 16 : 20} color={loading ? "transparent" : fg} strokeWidth={2} />}
      {/* le libellé reste en place pendant le chargement : largeur stable, lu par les lecteurs d'écran */}
      {loading && (
        <View style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={fg} />
        </View>
      )}
      <View style={loading ? { opacity: 0 } : undefined}>
        <Text variant={size === "sm" ? "sm" : "base"} tone={textTone[variant]} className="font-semibold">
          {label}
        </Text>
      </View>
      {trailing}
    </Pressable>
  );
}

export function IconButton({
  icon: IconCmp, label, onPress, className, tone = "default",
}: { icon: Icon; label: string; onPress?: () => void; className?: string; tone?: "default" | "accent" | "danger" }) {
  const { colors } = useTheme();
  const color = { default: colors.text, accent: colors.accent, danger: colors.danger }[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn("h-12 w-12 items-center justify-center rounded-pill active:bg-surface-2", className)}
    >
      <IconCmp size={22} color={color} />
    </Pressable>
  );
}
