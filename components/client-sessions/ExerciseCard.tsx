import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import type { SessionExerciseDetail } from '@/lib/types/api';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseCardProps {
  exercise: SessionExerciseDetail;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatRest = (restSeconds: number | null) => {
    if (!restSeconds) return null;
    if (restSeconds < 60) return `${restSeconds}s`;
    const minutes = Math.floor(restSeconds / 60);
    const seconds = restSeconds % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  };

  return (
    <View className="bg-surface border border-border rounded-xl p-4 mb-3">
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-start justify-between"
      >
        <View className="flex-1">
          <Text className="text-text-primary text-lg font-semibold mb-2">
            {exercise.name}
          </Text>

          <View className="flex-row items-center gap-4 mb-2">
            <View className="flex-row items-center">
              <Ionicons name="repeat" size={16} color="#A3ADC8" />
              <Text className="text-text-secondary text-sm ml-1">
                {exercise.sets} × {exercise.reps}
              </Text>
            </View>

            {exercise.restSeconds && (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#A3ADC8" />
                <Text className="text-text-secondary text-sm ml-1">
                  {formatRest(exercise.restSeconds)} pauză
                </Text>
              </View>
            )}
          </View>

          {exercise.tempo && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="speedometer-outline" size={16} color="#A3ADC8" />
              <Text className="text-text-secondary text-sm ml-1">
                Tempo: {exercise.tempo}
              </Text>
            </View>
          )}

          {exercise.equipment && exercise.equipment.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-2">
              {exercise.equipment.map((item, idx) => (
                <View key={idx} className="bg-background px-2 py-1 rounded-full">
                  <Text className="text-text-secondary text-xs">{item}</Text>
                </View>
              ))}
            </View>
          )}

          {exercise.notes && (
            <View className="mt-2 bg-background p-2 rounded-lg">
              <Text className="text-text-secondary text-sm">{exercise.notes}</Text>
            </View>
          )}
        </View>

        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#A3ADC8"
        />
      </Pressable>

      {isExpanded && (
        <View className="mt-4 border-t border-border pt-4">
          {exercise.description && (
            <View className="mb-4">
              <Text className="text-text-primary font-semibold mb-2">Descriere</Text>
              <Text className="text-text-secondary text-sm leading-5">
                {exercise.description}
              </Text>
            </View>
          )}

          {exercise.howTo && exercise.howTo.length > 0 && (
            <View className="mb-4">
              <Text className="text-text-primary font-semibold mb-2">
                Cum se execută
              </Text>
              {exercise.howTo.map((step, idx) => (
                <View key={idx} className="flex-row mb-2">
                  <Text className="text-primary font-semibold mr-2">{idx + 1}.</Text>
                  <Text className="text-text-secondary text-sm leading-5 flex-1">
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {exercise.cues && exercise.cues.length > 0 && (
            <View className="mb-4">
              <Text className="text-text-primary font-semibold mb-2">
                Indicații tehnice
              </Text>
              {exercise.cues.map((cue, idx) => (
                <View key={idx} className="flex-row items-start mb-2">
                  <Ionicons name="checkmark-circle" size={16} color="#f798af" />
                  <Text className="text-text-secondary text-sm leading-5 ml-2 flex-1">
                    {cue}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {exercise.mistakes && exercise.mistakes.length > 0 && (
            <View>
              <Text className="text-text-primary font-semibold mb-2">
                Greșeli frecvente
              </Text>
              {exercise.mistakes.map((mistake, idx) => (
                <View key={idx} className="flex-row items-start mb-2">
                  <Ionicons name="close-circle" size={16} color="#F87171" />
                  <Text className="text-text-secondary text-sm leading-5 ml-2 flex-1">
                    {mistake}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
