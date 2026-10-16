import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "./cn";

export type TextVariant = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "display" | "counter";
export type TextTone = "default" | "muted" | "subtle" | "accent" | "danger" | "success" | "warning" | "panic" | "on-accent" | "on-panic";

const variantClass: Record<TextVariant, string> = {
  xs: "text-xs font-medium",
  sm: "text-sm font-sans",
  base: "text-base font-sans",
  lg: "text-lg font-semibold",
  xl: "text-xl font-bold",
  "2xl": "text-2xl font-bold",
  display: "text-display font-extrabold",
  counter: "text-counter font-extrabold",
};

const toneClass: Record<TextTone, string> = {
  default: "text-text",
  muted: "text-text-muted",
  subtle: "text-text-subtle",
  accent: "text-accent",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
  panic: "text-panic",
  "on-accent": "text-on-accent",
  "on-panic": "text-on-panic",
};

export type TextProps = RNTextProps & { variant?: TextVariant; tone?: TextTone; className?: string };

export function Text({ variant = "base", tone = "default", className, style, ...rest }: TextProps) {
  const isHeading = variant === "xl" || variant === "2xl" || variant === "display";
  return (
    <RNText
      accessibilityRole={isHeading ? "header" : rest.accessibilityRole}
      maxFontSizeMultiplier={variant === "counter" ? 1.2 : 1.6}
      className={cn(variantClass[variant], toneClass[tone], className)}
      style={[variant === "counter" || variant === "display" ? { fontVariant: ["tabular-nums"] } : null, style]}
      {...rest}
    />
  );
}
