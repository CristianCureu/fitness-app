import { Button } from "@/components/ui/button";
import { useClient } from "@/lib/hooks/queries/use-clients";
import type { ClientStatus } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const STATUS_LABELS: Record<ClientStatus, string> = {
  ACTIVE: "Activ",
  PAUSED: "Pauza",
  INACTIVE: "Inactiv",
};

export default function ClientViewPreviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const clientQuery = useClient(clientId || "");
  const client = clientQuery.data;

  const timeline = useMemo(() => {
    if (!client?.programStartDate || !client?.programWeeks) return null;
    const start = new Date(client.programStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + client.programWeeks * 7);
    const total = end.getTime() - start.getTime();
    const elapsed = Math.min(Math.max(Date.now() - start.getTime(), 0), total);
    const progress = total > 0 ? elapsed / total : 0;
    return { start, end, progress };
  }, [client?.programStartDate, client?.programWeeks]);

  if (!clientId || clientQuery.isLoading || !client) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#f798af" />
        <Text className="text-text-muted text-sm mt-3">Deschidem vizualizarea clientului...</Text>
      </View>
    );
  }

  const goalText = client.goalDescription || "Fara obiectiv specificat deocamdata.";
  const frequencyLabel = client.recommendedSessionsPerWeek
    ? `${client.recommendedSessionsPerWeek}x pe saptamana`
    : "Frecventa nu este setata";

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-4">
        <Text className="text-text-secondary text-xs uppercase tracking-widest mb-1">
          Vizualizare client
        </Text>
        <Text className="text-text-primary text-2xl font-bold">
          {client.firstName} {client.lastName}
        </Text>
        <Text className="text-text-muted text-sm mt-1">
          Status: {STATUS_LABELS[client.status]} • {frequencyLabel}
        </Text>
      </View>

      <View className="px-6 pb-8">
        <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
          <Text className="text-text-secondary text-xs uppercase tracking-widest mb-2">
            Obiectivul meu
          </Text>
          <Text className="text-text-primary text-base leading-6">{goalText}</Text>
          <View className="flex-row items-center gap-2 mt-3">
            <Ionicons name="flash-outline" size={18} color="#f798af" />
            <Text className="text-text-secondary text-sm">{frequencyLabel}</Text>
          </View>
        </View>

        <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
          <Text className="text-text-secondary text-xs uppercase tracking-widest mb-3">
            Program
          </Text>
          {timeline ? (
            <>
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary text-sm">
                  Start: {timeline.start.toLocaleDateString()}
                </Text>
                <Text className="text-text-secondary text-sm">
                  Final: {timeline.end.toLocaleDateString()}
                </Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden mb-2">
                <View
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(Math.max(timeline.progress * 100, 4), 100)}%` }}
                />
              </View>
              <Text className="text-text-muted text-xs">
                {client.programWeeks} saptamani • progres estimat {(timeline.progress * 100).toFixed(0)}%
              </Text>
            </>
          ) : (
            <Text className="text-text-muted text-sm">
              Programul nu are inca un timeline setat.
            </Text>
          )}
        </View>

        <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
          <Text className="text-text-secondary text-xs uppercase tracking-widest mb-3">
            Onboarding
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-secondary text-sm">Greutate</Text>
            <Text className="text-text-primary text-sm font-semibold">
              {client.weight ? `${client.weight} kg` : "—"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-secondary text-sm">Inaltime</Text>
            <Text className="text-text-primary text-sm font-semibold">
              {client.height ? `${client.height} cm` : "—"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-secondary text-sm">Varsta</Text>
            <Text className="text-text-primary text-sm font-semibold">
              {client.age ? `${client.age} ani` : "—"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mt-3">
            <Ionicons
              name={client.onboardingCompleted ? "checkmark-circle" : "hourglass-outline"}
              size={18}
              color={client.onboardingCompleted ? "#7be495" : "#f4b86b"}
            />
            <Text className="text-text-secondary text-sm">
              {client.onboardingCompleted
                ? "Onboarding finalizat - vezi aplicatia ca si client."
                : "Onboarding in curs - vezi ce ar primi clientul."}
            </Text>
          </View>
        </View>

        <Button label="Inchide modul client" variant="outline" onPress={() => router.back()} fullWidth />
      </View>
    </ScrollView>
  );
}
