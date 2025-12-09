import type { ClientProfile } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { ClientStatusPill } from "./ClientStatusPill";

function initialsForClient(client: ClientProfile) {
  const first = client.firstName?.[0] ?? "";
  const last = client.lastName?.[0] ?? "";
  return (first + last || "?").toUpperCase();
}

interface ClientCardProps {
  client: ClientProfile;
  onPress: () => void;
}

export function ClientCard({ client, onPress }: ClientCardProps) {
  const goalPreview = client.goalDescription?.trim() || "Fără obiectiv adăugat încă";
  const frequencyLabel = client.recommendedSessionsPerWeek
    ? `${client.recommendedSessionsPerWeek}x / săpt`
    : "Frecvență nesetată";

  return (
    <Pressable
      onPress={onPress}
      className="bg-surface border border-border rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-start gap-4">
        <View className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
          <Text className="text-primary font-bold text-lg">
            {initialsForClient(client)}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-text-primary text-lg font-semibold">
                {client.firstName} {client.lastName}
              </Text>
              <ClientStatusPill status={client.status} />
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A3ADC8" />
          </View>

          <Text className="text-text-secondary text-sm mb-2" numberOfLines={2}>
            {goalPreview}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="repeat-outline" size={16} color="#A3ADC8" />
              <Text className="text-text-muted text-xs">{frequencyLabel}</Text>
            </View>
            {client.programWeeks ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="calendar-outline" size={16} color="#A3ADC8" />
                <Text className="text-text-muted text-xs">
                  {client.programWeeks} săpt program
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}