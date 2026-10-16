import type { ReactNode } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import { cn } from "./cn";

export function Card({ className, raised, ...rest }: ViewProps & { className?: string; raised?: boolean }) {
  return <View className={cn("rounded-lg p-4", raised ? "bg-surface-2" : "bg-surface", "border border-border", className)} {...rest} />;
}

export function PressableCard({
  children, onPress, label, className, selected,
}: { children: ReactNode; onPress?: () => void; label: string; className?: string; selected?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selected !== undefined ? { selected } : undefined}
      onPress={onPress}
      className={cn(
        "rounded-lg border bg-surface p-4 active:bg-surface-2",
        selected ? "border-accent border-2" : "border-border",
        className
      )}
    >
      {children}
    </Pressable>
  );
}
