import { LinearGradient } from "expo-linear-gradient";
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

      {/* Empty State */}
      <View className="px-6">
        <View className="bg-surface border border-border rounded-3xl p-8 items-center">
          <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
            <Text className="text-primary text-4xl">🏋️</Text>
          </View>
          <Text className="text-text-primary text-lg font-bold mb-2">
            No Workouts Yet
          </Text>
          <Text className="text-text-muted text-sm text-center mb-6">
            Start tracking your exercises to see your progress
          </Text>
          <LinearGradient
            colors={["#f798af", "#e5749a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl"
          >
            <TouchableOpacity className="px-8 py-3">
              <Text className="text-white font-bold">Create Workout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}
