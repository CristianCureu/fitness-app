import { Button } from "@/components/ui/button";
import { Text, View } from "react-native";

interface EmptyClientsListProps {
  hasActiveFilters: boolean;
  onPressInvite: () => void;
}

export function EmptyClientsList({ hasActiveFilters, onPressInvite }: EmptyClientsListProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-6 items-start">
      <Text className="text-text-primary text-base font-semibold mb-1">
        Niciun client găsit
      </Text>
      <Text className="text-text-muted text-sm">
        {hasActiveFilters
          ? "Încearcă alt termen de căutare sau filtru."
          : "Trimite un nou link de invitare pentru a adăuga clienți."}
      </Text>
      {!hasActiveFilters && (
        <Button
          label="Generează invitație"
          variant="secondary"
          onPress={onPressInvite}
          className="mt-4"
        />
      )}
    </View>
  );
}