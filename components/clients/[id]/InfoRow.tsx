import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border/60 last:border-b-0">
      <View className="flex-row items-center gap-2">
        {icon ? <Ionicons name={icon} size={16} color="#A3ADC8" /> : null}
        <Text className="text-text-secondary text-sm">{label}</Text>
      </View>
      <Text className="text-text-primary text-sm font-semibold">{value}</Text>
    </View>
  );
}
