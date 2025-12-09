import type { Program } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface ProgramPickerModalProps {
  visible: boolean;
  programs: Program[];
  loading?: boolean;
  onSelect: (program: Program) => void;
  onClose: () => void;
}

export function ProgramPickerModal({
  visible,
  programs,
  loading,
  onSelect,
  onClose,
}: ProgramPickerModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-background">
        <View className="px-6 pt-16 pb-4 border-b border-border">
          <Text className="text-text-secondary text-xs uppercase tracking-[2px]">
            Alege program
          </Text>
          <Text className="text-text-primary text-2xl font-bold mt-1">Template-uri</Text>
          <Text className="text-text-muted text-sm mt-1">
            Selectează un program de bază pe care să îl asignezi.
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {loading ? (
            <View className="py-10 items-center">
              <Ionicons name="sync-outline" size={20} color="#f798af" />
              <Text className="text-text-muted text-sm mt-3">
                Încărcăm programele disponibile...
              </Text>
            </View>
          ) : programs.length ? (
            programs.map((program) => (
              <Pressable
                key={program.id}
                onPress={() => onSelect(program)}
                className="bg-surface border border-border rounded-2xl p-4 mb-3 flex-row items-start gap-3"
              >
                <View className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center">
                  <Text className="text-primary font-semibold">
                    {program.sessionsPerWeek}x
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">{program.name}</Text>
                  <Text className="text-text-muted text-sm" numberOfLines={2}>
                    {program.description || "Fără descriere"}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <Ionicons name="calendar-outline" size={14} color="#A3ADC8" />
                    <Text className="text-text-secondary text-xs">
                      {program.durationWeeks ? `${program.durationWeeks} săpt` : "Durată liberă"}
                    </Text>
                    <Text className="text-text-muted text-xs">•</Text>
                    <Text className="text-text-secondary text-xs">
                      {program.sessions.length} sesiuni
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#A3ADC8" />
              </Pressable>
            ))
          ) : (
            <View className="bg-surface border border-border rounded-2xl p-5">
              <Text className="text-text-primary font-semibold">Nu există programe</Text>
              <Text className="text-text-muted text-sm mt-2">
                Adaugă un program nou sau clonează unul existent înainte de a-l asigna.
              </Text>
            </View>
          )}
        </ScrollView>

        <View className="px-6 pb-8 pt-2 border-t border-border bg-background">
          <Pressable
            onPress={onClose}
            className="h-14 rounded-2xl px-4 flex-row items-center justify-center border border-border"
          >
            <Text className="text-text-secondary font-semibold">Închide</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
