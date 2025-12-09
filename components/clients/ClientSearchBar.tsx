import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

interface ClientSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  isSearching: boolean;
}

export function ClientSearchBar({ value, onChangeText, isSearching }: ClientSearchBarProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl px-4 py-3 flex-row items-center gap-3">
      {isSearching ? (
        <ActivityIndicator size="small" color="#A3ADC8" />
      ) : (
        <Ionicons name="search" size={18} color="#A3ADC8" />
      )}
      <TextInput
        placeholder="Caută după nume"
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
        className="flex-1 text-text-primary"
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={18} color="#6b7280" />
        </Pressable>
      )}
    </View>
  );
}