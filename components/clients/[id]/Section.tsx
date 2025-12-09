import type { ReactNode } from "react";
import { Text, View } from "react-native";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
      <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}
