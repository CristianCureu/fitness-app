import type { ProgramHistoryEntry } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Section } from "./Section";

interface ProgramHistorySectionProps {
  history?: ProgramHistoryEntry[];
  loading?: boolean;
}

const PREVIEW_COUNT = 3;

export function ProgramHistorySection({ history, loading }: ProgramHistorySectionProps) {
  const [expanded, setExpanded] = useState(false);

  const displayedHistory = expanded ? history : history?.slice(0, PREVIEW_COUNT);
  const hasMore = (history?.length || 0) > PREVIEW_COUNT;

  return (
    <Section title="Istoric programe" icon="time-outline">
      {loading ? (
        <View className="py-6 items-center">
          <ActivityIndicator color="#f798af" />
          <Text className="text-text-muted text-sm mt-2">Încărcăm istoricul...</Text>
        </View>
      ) : history && history.length ? (
        <>
          {displayedHistory?.map((entry, idx) => {
            const isLast = expanded ? idx === history.length - 1 : idx === displayedHistory.length - 1;
            return (
              <View
                key={`${entry.date}-${idx}`}
                className="flex-row gap-3 pb-4 mb-4"
              >
                <View className="w-10 items-center relative">
                  {!isLast && (
                    <View className="absolute top-3 bottom-0 left-1/2 w-0.5 bg-border/50" style={{ marginLeft: -1 }} />
                  )}
                  <Ionicons
                    name="ellipse"
                    size={12}
                    color="#f798af"
                    style={{ marginTop: 2 }}
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
          })}

          {hasMore && (
            <Pressable
              onPress={() => setExpanded(!expanded)}
              className="flex-row items-center justify-center gap-2 py-3 bg-surface border border-border rounded-2xl mt-2"
            >
              <Text className="text-primary font-semibold text-sm">
                {expanded ? "Arată mai puțin" : `Vezi toate (${history.length})`}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#f798af"
              />
            </Pressable>
          )}
        </>
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
