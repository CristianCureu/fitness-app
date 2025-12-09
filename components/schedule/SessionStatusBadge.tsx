import type { SessionStatus } from "@/lib/types/api";
import { Text, View } from "react-native";
import { STATUS_STYLES } from "./SessionCard";

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  return (
    <View
      className="px-3 py-1 rounded-full self-start"
      style={{ backgroundColor: styles.bg }}
    >
      <Text className="text-xs font-semibold" style={{ color: styles.text }}>
        {styles.label}
      </Text>
    </View>
  );
}
