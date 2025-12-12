import { Exercise } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface ExerciseInfoModalProps {
  visible: boolean;
  exercise?: Exercise | null;
  onClose: () => void;
}

const formatLabel = (value?: string) => {
  if (!value) return "-";
  const normalized = typeof value === "string" ? value : String(value);
  return normalized
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const renderList = (label: string, items?: string[]) => {
  if (!items || items.length === 0) return null;
  return (
    <View className="mb-5">
      <Text className="text-text-secondary text-xs font-semibold uppercase tracking-[1px] mb-2">
        {label}
      </Text>
      {items.map((item, idx) => (
        <View key={`${label}-${idx}`} className="flex-row items-start gap-2 mb-1.5">
          <Text className="text-primary mt-0.5">•</Text>
          <Text className="text-text-primary flex-1">{item}</Text>
        </View>
      ))}
    </View>
  );
};

export function ExerciseInfoModal({ exercise, visible, onClose }: ExerciseInfoModalProps) {
  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-background rounded-t-3xl" style={{ maxHeight: "85%" }}>
          <View className="flex-row items-start justify-between px-6 pt-6 pb-4 border-b border-border">
            <View className="flex-1 pr-4">
              <Text className="text-text-secondary text-xs uppercase tracking-[2px]">
                Exercițiu
              </Text>
              <Text className="text-text-primary text-2xl font-bold mt-1">
                {exercise.name}
              </Text>
              {exercise.description ? (
                <Text className="text-text-muted text-sm mt-2">{exercise.description}</Text>
              ) : null}
              <View className="flex-row flex-wrap gap-2 mt-3">
                <View className="px-3 py-1 rounded-full bg-primary/15 border border-primary/30">
                  <Text className="text-primary text-xs font-semibold">
                    {formatLabel(exercise.difficulty)}
                  </Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-surface border border-border">
                  <Text className="text-text-secondary text-xs font-semibold">
                    {formatLabel(exercise.category)}
                  </Text>
                </View>
                <View className="px-3 py-1 rounded-full bg-surface border border-border">
                  <Text className="text-text-secondary text-xs font-semibold">
                    {formatLabel(exercise.equipment)}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable onPress={onClose} className="p-2 -mr-2">
              <Ionicons name="close" size={22} color="#A3ADC8" />
            </Pressable>
          </View>

          <ScrollView
            className="px-6 pt-4"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {renderList("Cum se execută", exercise.howTo)}
            {renderList("Cues", exercise.cues)}
            {renderList("Greșeli comune", exercise.mistakes)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
