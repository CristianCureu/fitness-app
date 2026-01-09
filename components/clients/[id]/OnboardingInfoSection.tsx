import type { ClientProfile } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { InfoRow } from "./InfoRow";
import { Section } from "./Section";

interface OnboardingInfoSectionProps {
  client: ClientProfile;
}

export function OnboardingInfoSection({ client }: OnboardingInfoSectionProps) {
  const onboardingInfo = [
    {
      label: "Greutate",
      value: client.weight ? `${client.weight} kg` : "—",
      icon: "barbell-outline" as const,
    },
    {
      label: "Înălțime",
      value: client.height ? `${client.height} cm` : "—",
      icon: "body-outline" as const,
    },
    {
      label: "Vârstă",
      value: client.age ? `${client.age} ani` : "—",
      icon: "hourglass-outline" as const,
    },
    {
      label: "Timezone",
      value: client.timezone || "nesetat",
      icon: "time-outline" as const,
    },
  ];

  return (
    <Section title="Info onboarding" icon="clipboard-outline">
      {onboardingInfo.map((item) => (
        <InfoRow key={item.label} label={item.label} value={item.value} icon={item.icon} />
      ))}
      <View className="flex-row items-center gap-2 mt-3">
        <Ionicons
          name={client.onboardingCompleted ? "checkmark-circle" : "alert-circle-outline"}
          size={18}
          color={client.onboardingCompleted ? "#7be495" : "#f4b86b"}
        />
        <Text className="text-text-secondary text-sm">
          {client.onboardingCompleted ? "Onboarding finalizat" : "Onboarding încă în curs"}
        </Text>
      </View>
    </Section>
  );
}
