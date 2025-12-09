import type { ClientStatus } from "@/lib/types/api";
import { Text, View } from "react-native";

const STATUS_STYLES: Record<ClientStatus, { label: string; bg: string; text: string }> = {
  ACTIVE: { label: "Activ", bg: "#1f3d2b", text: "#7be495" },
  COMPLETED: { label: "Pauză", bg: "#382b1f", text: "#f4b86b" },
  INACTIVE: { label: "Inactiv", bg: "#3a2a2a", text: "#f87171" },
};

export function ClientStatusPill({ status }: { status: ClientStatus }) {
  const styles = STATUS_STYLES[status];
  return (
    <View className="px-3 py-1 rounded-full" style={{ backgroundColor: styles.bg }}>
      <Text className="text-xs font-semibold" style={{ color: styles.text }}>
        {styles.label}
      </Text>
    </View>
  );
}