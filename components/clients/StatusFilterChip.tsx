import { Pressable, Text } from "react-native";

interface StatusFilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function StatusFilterChip({ label, active, onPress }: StatusFilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-2 rounded-full border ${
        active ? "border-primary/70 bg-primary/15" : "border-border bg-surface"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          active ? "text-primary" : "text-text-secondary"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}