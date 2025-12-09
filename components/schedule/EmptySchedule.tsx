import { Button } from "@/components/ui/button";
import { Text, View } from "react-native";

interface EmptyScheduleProps {
  onAddSession: () => void;
}

export function EmptySchedule({ onAddSession }: EmptyScheduleProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-6 items-start">
      <Text className="text-text-primary text-base font-semibold mb-1">
        Nicio sesiune programată
      </Text>
      <Text className="text-text-muted text-sm">
        Adaugă prima sesiune pentru această săptămână.
      </Text>
      <Button
        label="Adaugă sesiune"
        variant="secondary"
        onPress={onAddSession}
        className="mt-4"
      />
    </View>
  );
}
