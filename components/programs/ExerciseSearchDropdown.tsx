import type { Exercise, ExerciseCategory } from "@/lib/types/api";
import { useExerciseSearch, useRecommendedExercises } from "@/lib/hooks/queries/use-exercises";
import { colors } from "@/lib/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useMemo } from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface ExerciseSearchDropdownProps {
  value?: Exercise;
  onChange: (exercise: Exercise) => void;
  recommendedCategories?: ExerciseCategory[];
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  placeholder?: string;
  error?: string;
}

export function ExerciseSearchDropdown({
  value,
  onChange,
  recommendedCategories,
  difficulty,
  placeholder = "Caută exercițiu...",
  error,
}: ExerciseSearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch recommendations if categories are provided
  const { data: recommendedData } = useRecommendedExercises(
    recommendedCategories && recommendedCategories.length > 0
      ? { categories: recommendedCategories, difficulty }
      : undefined
  );

  // Fetch search results when user types
  const { data: searchResults } = useExerciseSearch(
    searchQuery.length >= 2
      ? { search: searchQuery, difficulty, limit: 20 }
      : undefined
  );

  // Combine and prioritize results: recommendations first, then search results
  const exercises = useMemo(() => {
    const recommended = recommendedData?.allExercises || [];
    const searched = searchResults || [];

    if (searchQuery.length < 2) {
      // Show only recommendations when not searching
      return recommended;
    }

    // When searching, merge recommendations and search results
    // Remove duplicates, keeping recommendations first
    const recommendedIds = new Set(recommended.map((ex) => ex.id));
    const uniqueSearched = searched.filter((ex) => !recommendedIds.has(ex.id));

    return [...recommended, ...uniqueSearched];
  }, [recommendedData, searchResults, searchQuery]);

  // Group exercises by category for display
  const groupedExercises = useMemo(() => {
    if (!recommendedData || searchQuery.length >= 2) {
      return null;
    }

    const groups: { category: string; exercises: Exercise[] }[] = [];

    recommendedCategories?.forEach((cat) => {
      const categoryExercises = recommendedData.exercisesByCategory[cat] || [];
      if (categoryExercises.length > 0) {
        groups.push({
          category: formatCategoryName(cat),
          exercises: categoryExercises,
        });
      }
    });

    return groups;
  }, [recommendedData, recommendedCategories, searchQuery]);

  const renderItem = (item: Exercise) => {
    const isRecommended = recommendedData?.allExercises.some((ex) => ex.id === item.id);

    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-text-primary font-semibold flex-1">
                {item.name}
              </Text>
              {isRecommended && (
                <View
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    Recomandat
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center gap-2 mt-1">
              <Text className="text-text-muted text-xs">
                {formatEquipment(item.equipment)}
              </Text>
              <Text className="text-text-muted text-xs">•</Text>
              <Text className="text-text-muted text-xs">
                {formatDifficulty(item.difficulty)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Dropdown
        data={exercises}
        search
        searchPlaceholder="Caută exercițiu..."
        labelField="name"
        valueField="id"
        placeholder={placeholder}
        value={value?.id}
        onChangeText={setSearchQuery}
        onChange={(item) => onChange(item as Exercise)}
        renderItem={renderItem}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
        }}
        containerStyle={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
        itemContainerStyle={{
          backgroundColor: colors.surface,
        }}
        itemTextStyle={{
          color: colors.textPrimary,
        }}
        selectedTextStyle={{
          color: colors.textPrimary,
          fontSize: 14,
        }}
        inputSearchStyle={{
          backgroundColor: colors.background,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.textPrimary,
          fontSize: 14,
          paddingHorizontal: 12,
        }}
        placeholderStyle={{
          color: colors.textSecondary,
          fontSize: 14,
        }}
        renderLeftIcon={() => (
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        )}
      />

      {error && (
        <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 }}>
          {error}
        </Text>
      )}

      {/* Show category hints when not searching */}
      {groupedExercises && searchQuery.length < 2 && (
        <View className="mt-2">
          <Text className="text-text-muted text-xs mb-1">
            💡 Recomandări pe categorii:
          </Text>
          {groupedExercises.map((group, idx) => (
            <Text key={idx} className="text-text-secondary text-xs ml-2">
              • {group.category}: {group.exercises.length} exerciții
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function formatCategoryName(category: ExerciseCategory): string {
  const names: Record<ExerciseCategory, string> = {
    SQUAT: "Squat",
    HINGE: "Hinge",
    HORIZONTAL_PUSH: "Împingere orizontală",
    HORIZONTAL_PULL: "Tragere orizontală",
    VERTICAL_PUSH: "Împingere verticală",
    VERTICAL_PULL: "Tragere verticală",
    LUNGE: "Lunge",
    CORE: "Core",
    ACCESSORY: "Accesorii",
    OTHER: "Altele",
  };
  return names[category] || category;
}

function formatEquipment(equipment: string): string {
  const names: Record<string, string> = {
    BODYWEIGHT: "Greutate corporală",
    DUMBBELL: "Gantere",
    BARBELL: "Bară",
    KETTLEBELL: "Kettlebell",
    MACHINE: "Mașină",
    RESISTANCE_BAND: "Bandă rezistență",
    CABLE: "Cablu",
    OTHER: "Altele",
  };
  return names[equipment] || equipment;
}

function formatDifficulty(difficulty: string): string {
  const names: Record<string, string> = {
    BEGINNER: "Începător",
    INTERMEDIATE: "Intermediar",
    ADVANCED: "Avansat",
  };
  return names[difficulty] || difficulty;
}
