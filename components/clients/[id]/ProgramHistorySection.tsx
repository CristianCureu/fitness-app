import type { ProgramHistoryEntry } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { ActivityIndicator, Text, View } from "react-native";
import { Section } from "./Section";

interface ProgramHistorySectionProps {
  history?: ProgramHistoryEntry[];
  loading?: boolean;
}

export function ProgramHistorySection({ history, loading }: ProgramHistorySectionProps) {
  return (
    <Section title="Istoric programe">
      {loading ? (
        <View className="py-6 items-center">
          <ActivityIndicator color="#f798af" />
          <Text className="text-text-muted text-sm mt-2">Încărcăm istoricul...</Text>
        </View>
      ) : history && history.length ? (
        history.map((entry, idx) => {
          const isLast = idx === history.length - 1;
          return (
            <View
              key={`${entry.date}-${idx}`}
              className="flex-row gap-3 pb-4 mb-4 border-b border-border/70"
              style={isLast ? { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 } : undefined}
            >
              <View className="w-10 items-center">
                <View className="w-1 h-full bg-border rounded-full" />
                <Ionicons
                  name="ellipse"
                  size={12}
                  color="#f798af"
                  style={{ position: "absolute", top: 0 }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-text-secondary text-xs uppercase tracking-wider">
                  {dayjs(entry.date).format("DD MMM YYYY")}
                </Text>
                <Text className="text-text-primary font-semibold mt-1">
                  Recomandat: {entry.recommended.programName} ({entry.recommended.score.toFixed(1)}
                  /10, {entry.recommended.confidence.toLowerCase()})
                </Text>
                <Text className="text-text-secondary text-sm mt-1">
                  Selectat: {entry.selected.programName}{" "}
                  {entry.selected.wasRecommended ? "(recomandat)" : "(manual)"}
                </Text>
                {entry.trainerFeedback ? (
                  <Text className="text-text-muted text-xs mt-1">
                    Feedback: {entry.trainerFeedback}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })
      ) : (
        <View className="bg-background border border-border rounded-2xl p-4">
          <Text className="text-text-primary font-semibold">Fără istoric</Text>
          <Text className="text-text-muted text-sm mt-1">
            Încă nu au fost făcute recomandări sau modificări pentru acest client.
          </Text>
        </View>
      )}
    </Section>
  );
}
