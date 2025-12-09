import type { ClientStatus } from "@/lib/types/api";
import { View } from "react-native";
import { StatusFilterChip } from "./StatusFilterChip";

type StatusFilter = "ALL" | ClientStatus;

interface StatusFilterBarProps {
  activeFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

export function StatusFilterBar({ activeFilter, onFilterChange }: StatusFilterBarProps) {
  return (
    <View className="flex-row gap-2 mt-3">
      <StatusFilterChip
        label="Toți"
        active={activeFilter === "ALL"}
        onPress={() => onFilterChange("ALL")}
      />
      <StatusFilterChip
        label="Activi"
        active={activeFilter === "ACTIVE"}
        onPress={() => onFilterChange("ACTIVE")}
      />
      <StatusFilterChip
        label="Inactivi"
        active={activeFilter === "COMPLETED"}
        onPress={() => onFilterChange("COMPLETED")}
      />
    </View>
  );
}

export type { StatusFilter };
