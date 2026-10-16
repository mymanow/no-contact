import type { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "./Text";
import { Button } from "./Button";

/**
 * Feuille de confirmation (bas d'écran). Utilisée pour Reset & Reflect, suppression d'un élément du coffre.
 * Fermeture : bouton, tap sur le voile, retour Android. Le focus va au titre à l'ouverture.
 */
export function ConfirmSheet({
  visible, title, body, confirmLabel, cancelLabel = "Not now", tone = "primary", onConfirm, onCancel, children,
}: {
  visible: boolean; title: string; body?: string; confirmLabel: string; cancelLabel?: string;
  tone?: "primary" | "danger"; onConfirm: () => void; onCancel: () => void; children?: ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel} accessibilityViewIsModal>
      <Pressable accessibilityLabel="Close" onPress={onCancel} className="flex-1 bg-black/60" />
      <View className="gap-4 rounded-t-xl border border-border bg-surface px-gutter pb-10 pt-3">
        <View className="h-1 w-10 self-center rounded-pill bg-border" />
        <Text variant="xl">{title}</Text>
        {body && <Text variant="base" tone="muted">{body}</Text>}
        {children}
        <Button label={confirmLabel} variant={tone} onPress={onConfirm} full />
        <Button label={cancelLabel} variant="ghost" onPress={onCancel} full />
      </View>
    </Modal>
  );
}
