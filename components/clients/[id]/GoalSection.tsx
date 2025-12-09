import type { ClientProfile } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { Section } from "./Section";

interface GoalSectionProps {
  client: ClientProfile;
}

export function GoalSection({ client }: GoalSectionProps) {
  return (
    <Section title="Obiectiv">
      <Text className="text-text-primary text-base leading-6">
        {client.goalDescription || "Nu a fost definit un obiectiv detaliat încă."}
      </Text>
      <View className="flex-row items-center gap-2 mt-3">
        <Ionicons name="repeat-outline" size={18} color="#A3ADC8" />
        <Text className="text-text-secondary text-sm">
          Frecvență ideală:{" "}
          {client.recommendedSessionsPerWeek
            ? `${client.recommendedSessionsPerWeek} sesiuni/săpt`
            : "nesetată"}
        </Text>
      </View>
    </Section>
  );
}
