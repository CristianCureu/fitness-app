import { Button } from "@/components/ui/button";
import type { ClientProfile, ClientProgram, DayOfWeek } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Section } from "./Section";

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Lu",
  TUESDAY: "Ma",
  WEDNESDAY: "Mi",
  THURSDAY: "Jo",
  FRIDAY: "Vi",
  SATURDAY: "Sa",
  SUNDAY: "Du",
};

interface ActiveProgramSectionProps {
  client: ClientProfile;
  activeProgram?: ClientProgram | null;
  onAssignPress: () => void;
  onUpdateTrainingDays: (days: DayOfWeek[]) => void;
  updatingDays?: boolean;
  onRemove?: () => void;
  removing?: boolean;
}

function TrainingDaysModal({
  visible,
  onClose,
  initialDays,
  onSave,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  initialDays: DayOfWeek[];
  onSave: (days: DayOfWeek[]) => void;
  loading?: boolean;
}) {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(initialDays);

  useEffect(() => {
    if (visible) setSelectedDays(initialDays);
  }, [visible, initialDays]);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50 justify-center px-6" onPress={onClose}>
        <Pressable
          className="bg-surface border border-border rounded-2xl p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-text-primary text-lg font-semibold mb-3">
            Ajustează zilele de antrenament
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(DAY_LABELS) as DayOfWeek[]).map((day) => {
              const isActive = selectedDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={`px-3 py-2 rounded-full border ${
                    isActive
                      ? "border-primary/70 bg-primary/15"
                      : "border-border bg-background"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? "text-primary" : "text-text-secondary"
                    }`}
                  >
                    {DAY_LABELS[day]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="flex-row gap-3 mt-4">
            <Button
              label="Salvează"
              onPress={() => onSave(selectedDays)}
              loading={loading}
              disabled={!selectedDays.length}
              className="flex-1"
            />
            <Button label="Anulează" variant="ghost" onPress={onClose} className="flex-1" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ActiveProgramSection({
  client,
  activeProgram,
  onAssignPress,
  onUpdateTrainingDays,
  updatingDays,
  onRemove,
  removing,
}: ActiveProgramSectionProps) {
  const [showEditDays, setShowEditDays] = useState(false);
  const sessions = activeProgram
    ? [...activeProgram?.program?.sessions].sort((a, b) => a.dayNumber - b.dayNumber)
    : [];

    console.log(activeProgram, "active")

  return (
    <Section title="Program activ">
      {activeProgram ? (
        <>
          <View className="flex-row items-center justify-between">
            <View className="max-w-56">
              <Text className="text-text-primary text-lg font-semibold">
                {activeProgram.program.name}
              </Text>
              <Text className="text-text-muted text-sm mt-1">
                Start: {dayjs(activeProgram.startDate).format("DD MMM YYYY")} •{" "}
                {activeProgram.trainingDays.length} zile/săpt
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full border self-start ${
                activeProgram.isCustomized
                  ? "border-primary/60 bg-primary/15"
                  : "border-border bg-background"
              }`}
            >
              <Text
                className={`text-[10px] font-semibold uppercase tracking-widest ${
                  activeProgram.isCustomized ? "text-primary" : "text-text-secondary"
                }`}
              >
                {activeProgram.isCustomized ? "Personalizat" : "Template"}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mt-3">
            {activeProgram.trainingDays.map((day) => (
              <View
                key={day}
                className="px-3 py-2 rounded-full bg-primary/10 border border-primary/30"
              >
                <Text className="text-primary text-xs font-semibold">{DAY_LABELS[day]}</Text>
              </View>
            ))}
          </View>

          <View className="mt-3 bg-background/50 border border-border rounded-2xl p-3">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="list-circle-outline" size={18} color="#A3ADC8" />
              <Text className="text-text-secondary text-xs uppercase tracking-widest">
                Structura săptămânii
              </Text>
            </View>
            {sessions.map((session) => (
              <View
                key={session.id}
                className="flex-row items-start gap-3 py-2 border-b border-border/60 last:border-0"
              >
                <View className="w-9 h-9 rounded-xl bg-surface border border-border items-center justify-center">
                  <Text className="text-primary font-semibold">Zi {session.dayNumber}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">{session.name}</Text>
                  <Text className="text-text-secondary text-xs mt-1">{session.focus}</Text>
                  {session.notes ? (
                    <Text className="text-text-muted text-[11px] mt-1">{session.notes}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row gap-3 mt-4">
            <Button
              label="Schimbă program"
              variant="outline"
              onPress={onAssignPress}
              className="flex-1"
            />
            <Button
              label="Ajustează zilele"
              variant="secondary"
              onPress={() => setShowEditDays(true)}
              loading={updatingDays}
              className="flex-1"
            />
          </View>

          {onRemove && (
            <Button
              label="Scoate programul"
              variant="danger"
              onPress={onRemove}
              loading={removing}
              className="mt-3"
              fullWidth
            />
          )}
        </>
      ) : (
        <View className="items-start gap-3">
          <Text className="text-text-primary text-base font-semibold">
            {client.firstName} nu are un program activ
          </Text>
          <Text className="text-text-muted text-sm">
            Alege un template sau folosește recomandările AI pentru a-l porni.
          </Text>
          <Button label="Atribuie program" onPress={onAssignPress} />
        </View>
      )}

      {activeProgram && (
        <TrainingDaysModal
          visible={showEditDays}
          onClose={() => setShowEditDays(false)}
          initialDays={activeProgram.trainingDays}
          onSave={(days) => {
            onUpdateTrainingDays(days);
            setShowEditDays(false);
          }}
          loading={updatingDays}
        />
      )}
    </Section>
  );
}
