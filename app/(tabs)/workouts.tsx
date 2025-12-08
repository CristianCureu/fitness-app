import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WorkoutsScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      {/* Filters */}
      <View className="px-6 pt-16 pb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-3"
        >
          <TouchableOpacity className="bg-primary px-5 py-2 rounded-full">
            <Text className="text-white font-semibold">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-surface border border-border px-5 py-2 rounded-full">
            <Text className="text-text-secondary font-semibold">Strength</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-surface border border-border px-5 py-2 rounded-full">
            <Text className="text-text-secondary font-semibold">Cardio</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-surface border border-border px-5 py-2 rounded-full">
            <Text className="text-text-secondary font-semibold">Flexibility</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
