import type { ClientProfile, ClientStatus } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const STATUS_STYLES: Record<ClientStatus, { label: string; bg: string; text: string }> = {
  ACTIVE: { label: "Activ", bg: "#1f3d2b", text: "#7be495" },
  PAUSED: { label: "Pauză", bg: "#382b1f", text: "#f4b86b" },
  INACTIVE: { label: "Inactiv", bg: "#3a2a2a", text: "#f87171" },
};

interface ClientDetailHeaderProps {
  client: ClientProfile;
}

export function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  const status = client.status && client.status in STATUS_STYLES ? client.status : "ACTIVE";
  const styles = STATUS_STYLES[status];

  // Calculate program timeline with dayjs
  const timeline = (() => {
    if (!client.programStartDate || !client.programWeeks) return null;

    const start = dayjs(client.programStartDate);
    const end = start.add(client.programWeeks, "week");
    const now = dayjs();
    const totalDays = end.diff(start, "day");
    const elapsedDays = Math.min(Math.max(now.diff(start, "day"), 0), totalDays);
    const progress = totalDays > 0 ? elapsedDays / totalDays : 0;

    return { start, end, progress };
  })();

  return (
    <View className="bg-surface border-b border-border px-6 pt-16 pb-6 rounded-b-3xl">
      <View className="flex-row items-center justify-between mb-5">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-background/70 border border-border items-center justify-center"
        >
          <Ionicons name="arrow-back" size={18} color="#E8ECF5" />
        </Pressable>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: styles.bg }}>
          <Text className="text-xs font-semibold" style={{ color: styles.text }}>
            {styles.label}
          </Text>
        </View>
      </View>

      <Text className="text-text-secondary text-sm">Profil client</Text>
      <Text className="text-text-primary text-3xl font-bold mt-1">
        {client.firstName} {client.lastName}
      </Text>

      {timeline ? (
        <View className="mt-4 bg-background/40 border border-border rounded-2xl p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-secondary text-xs uppercase tracking-widest">
              Program
            </Text>
            <Text className="text-text-muted text-xs">
              Final: {timeline.end.format("DD.MM.YYYY")}
            </Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${Math.min(Math.max(timeline.progress * 100, 4), 100)}%` }}
            />
          </View>
          <Text className="text-text-muted text-xs mt-2">
            {client.programWeeks} săpt • Start {timeline.start.format("DD.MM.YYYY")}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
