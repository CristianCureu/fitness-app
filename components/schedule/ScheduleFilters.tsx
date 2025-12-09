import type { ClientProfile, SessionStatus } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { SESSION_STATUS_CONFIG } from "./SessionCard";

interface ScheduleFiltersProps {
  selectedClientId?: string;
  selectedStatus?: SessionStatus;
  onClientChange: (clientId?: string) => void;
  onStatusChange: (status?: SessionStatus) => void;
  clients: ClientProfile[];
}

const STATUS_FILTER_OPTIONS: { value?: SessionStatus; label: string }[] = [
  { value: undefined, label: "Toate" },
  { value: "SCHEDULED", label: SESSION_STATUS_CONFIG.SCHEDULED.label },
  { value: "COMPLETED", label: SESSION_STATUS_CONFIG.COMPLETED.label },
  { value: "CANCELLED", label: SESSION_STATUS_CONFIG.CANCELLED.label },
  { value: "NO_SHOW", label: SESSION_STATUS_CONFIG.NO_SHOW.label },
];

export function ScheduleFilters({
  selectedClientId,
  selectedStatus,
  onClientChange,
  onStatusChange,
  clients,
}: ScheduleFiltersProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name="filter-outline" size={18} color="#A3ADC8" />
        <Text className="text-text-secondary text-sm font-semibold">Filtre</Text>
      </View>

      {/* Client Filter */}
      <View className="mb-3">
        <Text className="text-text-muted text-xs mb-2">Client</Text>
        <View className="flex-row flex-wrap gap-2">
          <Pressable
            onPress={() => onClientChange(undefined)}
            className={`px-3 py-2 rounded-full border ${
              !selectedClientId
                ? "border-primary/70 bg-primary/15"
                : "border-border bg-background"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                !selectedClientId ? "text-primary" : "text-text-secondary"
              }`}
            >
              Toți clienții
            </Text>
          </Pressable>
          {clients.map((client) => (
            <Pressable
              key={client.id}
              onPress={() => onClientChange(client.id)}
              className={`px-3 py-2 rounded-full border ${
                selectedClientId === client.id
                  ? "border-primary/70 bg-primary/15"
                  : "border-border bg-background"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedClientId === client.id ? "text-primary" : "text-text-secondary"
                }`}
              >
                {client.firstName} {client.lastName}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Status Filter */}
      <View>
        <Text className="text-text-muted text-xs mb-2">Status</Text>
        <View className="flex-row flex-wrap gap-2">
          {STATUS_FILTER_OPTIONS.map((option) => (
            <Pressable
              key={option.value || "all"}
              onPress={() => onStatusChange(option.value)}
              className={`px-3 py-2 rounded-full border ${
                selectedStatus === option.value
                  ? "border-primary/70 bg-primary/15"
                  : "border-border bg-background"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedStatus === option.value ? "text-primary" : "text-text-secondary"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
