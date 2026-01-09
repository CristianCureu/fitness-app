import { Button } from "@/components/ui/button";
import type { Dayjs } from "dayjs";
import { Text, View } from "react-native";

interface WeekNavigatorProps {
  currentWeek: Dayjs;
  startOfWeek: Dayjs;
  endOfWeek: Dayjs;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentWeek: boolean;
}

export function WeekNavigator({
  currentWeek,
  startOfWeek,
  endOfWeek,
  onPrevious,
  onNext,
  onToday,
  isCurrentWeek,
}: WeekNavigatorProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-4 flex-row items-center justify-between">
      <Button
        label=" "
        variant="ghost"
        onPress={onPrevious}
        iconName="chevron-back"
        className="w-12"
      />
      <View className="flex-1 items-center">
        <Text className="text-text-primary text-lg font-semibold">
          {startOfWeek.format("D MMM")} - {endOfWeek.format("D MMM YYYY")}
        </Text>
        {!isCurrentWeek && (
          <Button
            label="Săptămâna curentă"
            variant="ghost"
            onPress={onToday}
            iconName="time-outline"
            className="mt-2"
          />
        )}
      </View>
      <Button
        label=" "
        variant="ghost"
        onPress={onNext}
        iconName="chevron-forward"
        className="w-12"
      />
    </View>
  );
}
