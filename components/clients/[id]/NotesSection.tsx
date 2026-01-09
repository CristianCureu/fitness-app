import type { ClientProfile } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { Section } from "./Section";

interface NotesSectionProps {
  client: ClientProfile;
}

export function NotesSection({ client }: NotesSectionProps) {
  return (
    <Section title="Notițe personale" icon="document-text-outline">
      <Text className="text-text-primary text-base leading-6">
        {client.goalDescription
          ? `Preferințe: ${client.goalDescription}`
          : "Nicio notiță sau preferință specificată încă."}
      </Text>
      <View className="flex-row items-center gap-2 mt-3">
        <Ionicons name="chatbubbles-outline" size={18} color="#A3ADC8" />
        <Text className="text-text-muted text-xs">
          Adaugă aici lucruri de evitat (ex: urăște genuflexiunile) sau obiceiuri alimentare.
        </Text>
      </View>
    </Section>
  );
}
