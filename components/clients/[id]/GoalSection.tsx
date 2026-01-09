import { useEffect, useState } from "react";
import type { ClientProfile } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { Section } from "./Section";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";
import { useUpdateClient } from "@/lib/hooks/queries/use-clients";

interface GoalSectionProps {
  client: ClientProfile;
}

export function GoalSection({ client }: GoalSectionProps) {
  const updateClient = useUpdateClient();
  const [goalDescription, setGoalDescription] = useState(client.goalDescription || "");
  const [recommendedSessions, setRecommendedSessions] = useState(
    client.recommendedSessionsPerWeek?.toString() || ""
  );

  useEffect(() => {
    setGoalDescription(client.goalDescription || "");
    setRecommendedSessions(client.recommendedSessionsPerWeek?.toString() || "");
  }, [client.goalDescription, client.recommendedSessionsPerWeek]);

  const handleSave = () => {
    updateClient.mutate({
      id: client.id,
      data: {
        goalDescription: goalDescription || undefined,
        recommendedSessionsPerWeek: recommendedSessions
          ? Number(recommendedSessions)
          : undefined,
      },
    });
  };

  return (
    <Section title="Obiectiv" icon="flag-outline">
      <View className="gap-3">
        <FormInput
          label="Obiectiv program"
          value={goalDescription}
          onChangeText={setGoalDescription}
          placeholder="Ex: -8kg in 3 luni"
        />
        <FormInput
          label="Frecventa ideala (sesiuni/sapt)"
          value={recommendedSessions}
          onChangeText={setRecommendedSessions}
          keyboardType="numeric"
          placeholder="Ex: 3"
        />
        <Button
          label="Salveaza obiectiv"
          onPress={handleSave}
          loading={updateClient.isPending}
          disabled={updateClient.isPending}
          iconName="save-outline"
        />
        <View className="flex-row items-center gap-2 mt-1">
          <Ionicons name="repeat-outline" size={18} color="#A3ADC8" />
          <Text className="text-text-secondary text-sm">
            Frecvență ideală:{" "}
            {client.recommendedSessionsPerWeek
              ? `${client.recommendedSessionsPerWeek} sesiuni/săpt`
              : "nesetată"}
          </Text>
        </View>
      </View>
    </Section>
  );
}
