import type { ComponentType, ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Camera, FileText, Image as ImageIcon, Lock, Mic, Star, Video } from "lucide-react-native";
import { Text } from "./Text";
import { cn } from "./cn";
import { useTheme } from "@/theme/ThemeProvider";

type Icon = ComponentType<{ size?: number; color?: string; strokeWidth?: number; fill?: string }>;

// ---------------------------------------------------------------- Vault
export type MediaType = "screenshot" | "photo" | "video" | "voice" | "text";
const mediaIcon: Record<MediaType, Icon> = { screenshot: Camera, photo: ImageIcon, video: Video, voice: Mic, text: FileText };
const mediaName: Record<MediaType, string> = { screenshot: "Screenshot", photo: "Photo", video: "Video", voice: "Voice note", text: "Note" };

/** Vignette du coffre (S11). Le média est flouté par défaut : on choisit de le revoir. */
export function MediaTile({
  type, caption, onPress, thumbnail, durationLabel,
}: { type: MediaType; caption?: string; onPress?: () => void; thumbnail?: ReactNode; durationLabel?: string }) {
  const { colors } = useTheme();
  const IconCmp = mediaIcon[type];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${mediaName[type]}${caption ? `: ${caption}` : ""}${durationLabel ? `, ${durationLabel}` : ""}`}
      onPress={onPress}
      className="aspect-square flex-1 overflow-hidden rounded-md border border-border bg-surface-2 active:opacity-80"
    >
      {thumbnail ?? (
        <View className="flex-1 items-center justify-center">
          <IconCmp size={28} color={colors["text-muted"]} />
        </View>
      )}
      <View className="absolute left-2 top-2 flex-row items-center gap-1 rounded-sm bg-bg/80 px-1.5 py-0.5">
        <IconCmp size={12} color={colors.text} />
        {durationLabel && <Text variant="xs">{durationLabel}</Text>}
      </View>
      {caption && (
        <View className="absolute bottom-0 left-0 right-0 bg-bg/80 px-2 py-1">
          <Text variant="xs" numberOfLines={1}>{caption}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------- Toolkit & Learn
export function ToolCard({
  title, meta, icon: IconCmp, favorite, locked, onPress, onToggleFavorite,
}: {
  title: string; meta: string; icon: Icon; favorite?: boolean; locked?: boolean;
  onPress?: () => void; onToggleFavorite?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${meta}${locked ? ", premium" : ""}`}
        onPress={onPress}
        className="flex-1 flex-row items-center gap-3"
      >
        <View className="h-12 w-12 items-center justify-center rounded-md bg-accent/15">
          <IconCmp size={22} color={colors.accent} />
        </View>
        <View className="flex-1">
          <Text variant="base" className="font-semibold">{title}</Text>
          <Text variant="sm" tone="muted">{meta}</Text>
        </View>
        {locked && <Lock size={16} color={colors["text-subtle"]} />}
      </Pressable>
      {onToggleFavorite && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          accessibilityState={{ selected: !!favorite }}
          onPress={onToggleFavorite}
          className="h-12 w-12 items-center justify-center"
        >
          <Star size={20} color={favorite ? colors.warning : colors["text-subtle"]} fill={favorite ? colors.warning : "transparent"} />
        </Pressable>
      )}
    </View>
  );
}

export function ArticleCard({ title, minutes, tag, read, onPress }: { title: string; minutes: number; tag: string; read?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${minutes} minute read. ${read ? "Read." : ""}`}
      onPress={onPress}
      className="gap-2 rounded-lg border border-border bg-surface p-4 active:bg-surface-2"
    >
      <Text variant="xs" tone="accent" className="uppercase">{tag}</Text>
      <Text variant="lg">{title}</Text>
      <Text variant="sm" tone="muted">{minutes} min{read ? " · read" : ""}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------- Paywall
export function PlanCard({
  title, price, sub, badge, selected, onPress,
}: { title: string; price: string; sub: string; badge?: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: !!selected }}
      accessibilityLabel={`${title}, ${price}, ${sub}${badge ? `, ${badge}` : ""}`}
      onPress={onPress}
      className={cn("flex-row items-center gap-3 rounded-lg bg-surface px-4 py-4", selected ? "border-2 border-accent" : "border border-border")}
    >
      <View className={cn("h-5 w-5 rounded-pill border-2", selected ? "border-accent bg-accent" : "border-border-input")} />
      <View className="flex-1">
        <Text variant="base" className="font-semibold">{title}</Text>
        <Text variant="sm" tone="muted">{sub}</Text>
      </View>
      <View className="items-end gap-1">
        {badge && (
          <View className="rounded-pill bg-accent px-2 py-0.5">
            <Text variant="xs" tone="on-accent">{badge}</Text>
          </View>
        )}
        <Text variant="lg">{price}</Text>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------- Progress
export function MilestoneBadge({ days, earned }: { days: number; earned: boolean }) {
  return (
    <View
      accessible
      accessibilityLabel={`${days} day milestone, ${earned ? "earned" : "locked"}`}
      className={cn("h-16 w-16 items-center justify-center rounded-pill border-2", earned ? "border-accent bg-accent/15" : "border-border bg-surface")}
    >
      <Text variant="lg" tone={earned ? "accent" : "subtle"}>{days}</Text>
      <Text variant="xs" tone={earned ? "accent" : "subtle"}>{days === 1 ? "day" : "days"}</Text>
    </View>
  );
}

// ---------------------------------------------------------------- États
export function EmptyState({
  icon: IconCmp, title, body, action,
}: { icon: Icon; title: string; body: string; action?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View className="items-center gap-3 rounded-lg border border-dashed border-border px-6 py-8">
      <IconCmp size={32} color={colors["text-subtle"]} />
      <Text variant="lg" className="text-center">{title}</Text>
      <Text variant="sm" tone="muted" className="text-center">{body}</Text>
      {action}
    </View>
  );
}

export function Toast({ tone = "success", message }: { tone?: "success" | "danger" | "neutral"; message: string }) {
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className={cn(
        "flex-row items-center gap-3 rounded-md border bg-surface-2 px-4 py-3",
        tone === "success" ? "border-success" : tone === "danger" ? "border-danger" : "border-border"
      )}
    >
      <View className={cn("h-2 w-2 rounded-pill", tone === "success" ? "bg-success" : tone === "danger" ? "bg-danger" : "bg-text-muted")} />
      <Text variant="sm" className="flex-1">{message}</Text>
    </View>
  );
}
