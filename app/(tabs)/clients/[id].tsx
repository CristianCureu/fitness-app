import {
  ClientDetailHeader,
  GoalSection,
  ImpersonateButton,
  NotesSection,
  OnboardingInfoSection,
} from "@/components/clients/[id]";
import { useClient } from "@/lib/hooks/queries/use-clients";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const clientQuery = useClient(clientId || "");

  const client = clientQuery.data;

  if (!clientId) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-primary">Client ID lipsă</Text>
      </View>
    );
  }

  if (clientQuery.isLoading || !client) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#f798af" />
        <Text className="text-text-muted text-sm mt-3">Încărcăm profilul clientului...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <ClientDetailHeader client={client} />

      <View className="px-6 pt-6 pb-10">
        <GoalSection client={client} />
        <OnboardingInfoSection client={client} />
        <NotesSection client={client} />
        <ImpersonateButton clientId={client.id} />
      </View>
    </ScrollView>
  );
}
