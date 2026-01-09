import type { ComponentProps, ReactNode } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

interface SectionProps {
  title: string;
  children: ReactNode;
  icon?: ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
}

export function Section({ title, children, icon, iconColor = "#A3ADC8" }: SectionProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
      <View className="flex-row items-center gap-2 mb-3">
        {icon ? <Ionicons name={icon} size={16} color={iconColor} /> : null}
        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}
