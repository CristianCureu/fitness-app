import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Ionicons } from "@expo/vector-icons";
import { useSessionDetails, useCompleteSession } from "@/lib/hooks/queries/use-sessions";
import { ExerciseCard } from "@/components/client-sessions";
import { CongratsOverlay } from "@/components/ui/congrats-overlay";
import { useAppUser } from "@/lib/stores/auth-store";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const appUser = useAppUser();
  const [notes, setNotes] = useState("");
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const sessionQuery = useSessionDetails(id);
  const completeSessionMutation = useCompleteSession();

  const session = sessionQuery.data;

  const handleComplete = () => {
    if (!session) return;

    Alert.alert(
      "Marchează sesiunea ca terminată",
      "Ești sigur că vrei să marchezi această sesiune ca terminată?",
      [
        { text: "Anulează", style: "cancel" },
        {
          text: "Confirmă",
          onPress: () => {
            completeSessionMutation.mutate(
              { id: session.id, data: { notes: notes || undefined } },
              {
                onSuccess: () => {
                  setShowCongrats(true);
                },
                onError: (error) => {
                  Alert.alert(
                    "Eroare",
                    error.message || "Nu am putut marca sesiunea ca terminată"
                  );
                },
              }
            );
          },
        },
      ]
    );
  };

  if (sessionQuery.isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#f798af" />
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-text-secondary text-lg text-center">
          Sesiunea nu a fost găsită
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary text-base">Înapoi</Text>
        </Pressable>
      </View>
    );
  }

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const clientTimezone = appUser?.clientProfile?.timezone || dayjs.tz.guess() || "UTC";
  const sessionDate = dayjs(session.startAt).tz(clientTimezone);
  const dayName = sessionDate.format("dddd");
  const dateFormatted = sessionDate.format("D MMMM YYYY");
  const timeFormatted = sessionDate.format("HH:mm");

  const now = dayjs().tz(clientTimezone);
  const canComplete =
    session.status === "SCHEDULED" &&
    (sessionDate.isBefore(now, "day") || sessionDate.isSame(now, "day"));

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 bg-surface border-b border-border">
        <Pressable onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#E8ECF5" />
        </Pressable>

        <Text className="text-text-primary text-3xl font-bold mb-2">
          {session.sessionName}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={16} color="#A3ADC8" />
          <Text className="text-text-secondary text-base ml-2 capitalize">
            {dayName}, {dateFormatted}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#A3ADC8" />
          <Text className="text-text-secondary text-base ml-2">{timeFormatted}</Text>
        </View>

        {session.sessionType && (
          <View className="mt-3">
            <View className="bg-background px-3 py-1 rounded-full self-start">
              <Text className="text-text-secondary text-xs">{session.sessionType}</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Exercises */}
        <View className="px-6 py-6">
          <Text className="text-text-secondary text-sm font-semibold mb-4 uppercase tracking-wider">
            Exerciții ({session.exercises?.length || 0})
          </Text>

          {session.exercises && session.exercises.length > 0 ? (
            session.exercises
              .sort((a, b) => a.orderInSession - b.orderInSession)
              .map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)
          ) : (
            <View className="bg-surface border border-border rounded-xl p-6 items-center">
              <Text className="text-text-secondary text-sm">
                Nu sunt exerciții pentru această sesiune
              </Text>
            </View>
          )}
        </View>

        {/* Notes Section (if completing) */}
        {canComplete && (
          <View className="px-6 mb-6">
            <Pressable
              onPress={() => setShowNotesInput(!showNotesInput)}
              className="flex-row items-center mb-3"
            >
              <Text className="text-text-secondary text-sm font-semibold uppercase tracking-wider">
                Notițe (opțional)
              </Text>
              <Ionicons
                name={showNotesInput ? "chevron-up" : "chevron-down"}
                size={20}
                color="#A3ADC8"
                style={{ marginLeft: 8 }}
              />
            </Pressable>

            {showNotesInput && (
              <TextInput
                className="bg-surface border border-border rounded-xl p-4 text-text-primary text-base"
                placeholder="Adaugă notițe despre această sesiune..."
                placeholderTextColor="#A3ADC8"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Complete Button */}
      {canComplete && (
        <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4">
          <Pressable
            onPress={handleComplete}
            disabled={completeSessionMutation.isPending}
            className="bg-primary py-4 rounded-xl items-center active:opacity-80 mb-4"
          >
            {completeSessionMutation.isPending ? (
              <ActivityIndicator color="#0F111A" />
            ) : (
              <Text className="text-background font-semibold text-lg">
                Marchează ca Terminat
              </Text>
            )}
          </Pressable>
        </View>
      )}

      <CongratsOverlay
        visible={showCongrats}
        message="Sesiune terminată. Super!"
        onDone={() => {
          setShowCongrats(false);
          router.back();
        }}
      />
    </View>
  );
}
