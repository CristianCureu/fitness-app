import type { Program } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Button } from "../ui/button";

type ProgramCardProps = {
  program: Program;
  onAssign?: (program: Program) => void;
  onDelete?: (program: Program) => void;
  onEdit?: (program: Program) => void;
};

const DAY_BADGES = ["A", "B", "C", "D", "E", "F", "G"];

export function ProgramCard({ program, onAssign, onDelete, onEdit }: ProgramCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const badgeLabel = program.isDefault ? "template" : "Personalizat";
  const sessions = [...program.sessions].sort((a, b) => a.dayNumber - b.dayNumber);

  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = -80;
  const isSwipeActive = useSharedValue(false);
  const expandHeight = useSharedValue(0);
  const expandOpacity = useSharedValue(0);
  const rotateChevron = useSharedValue(0);

  const handlePress = () => {
    // Only allow press when card is not swiped open
    if (translateX.value === 0 && !isSwipeActive.value) {
      // Animate expand/collapse
      if (!isOpen) {
        expandHeight.value = withTiming(1);
        expandOpacity.value = withTiming(1, { duration: 150 });
        rotateChevron.value = withSpring(1, { damping: 30 });
      } else {
        expandHeight.value = withTiming(0);
        expandOpacity.value = withTiming(0, { duration: 150 });
        rotateChevron.value = withSpring(0, { damping: 30 });
      }
      setIsOpen(!isOpen);
    } else if (translateX.value < 0) {
      // If card is swiped open, close it instead of toggling expand
      translateX.value = withSpring(0);
      isSwipeActive.value = false;
    }
  };

  const handleDeletePress = () => {
    translateX.value = withSpring(0);
    isSwipeActive.value = false;
    onDelete?.(program);
  };

  const contextX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      isSwipeActive.value = true;
      translateX.value = Math.min(
        0,
        Math.max(contextX.value + event.translationX, SWIPE_THRESHOLD)
      );
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD / 2) {
        translateX.value = withSpring(SWIPE_THRESHOLD);
      } else {
        translateX.value = withSpring(0);
        isSwipeActive.value = false;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const expandAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: expandHeight.value * 500, // Adjust max height as needed
    opacity: expandOpacity.value,
    overflow: 'hidden',
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateChevron.value * 180}deg` }],
  }));

  return (
    <View className="mb-3 relative overflow-hidden rounded-2xl">
      {onDelete && !program.isDefault && (
        <View className="absolute right-0 top-0 bottom-0 flex-row">
          <Pressable
            onPress={handleDeletePress}
            className="justify-center items-center w-20 bg-red-500"
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </Pressable>
        </View>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={!program.isDefault && animatedStyle}>
          <View className="bg-surface border border-border rounded-2xl p-4">
            <Pressable
              className="flex-row justify-between items-start gap-3"
              onPress={handlePress}
            >
              <View className="flex-1">
                <View className="flex-row items-center justify-between gap-2 mb-1">
                  <Text
                    className="text-text-primary text-lg font-semibold max-w-64"
                    numberOfLines={2}
                  >
                    {program.name}
                  </Text>
                  <View
                    className={`px-2 py-1 rounded-full border self-start ${
                      program.isDefault
                        ? "border-primary/50 bg-primary/15"
                        : "border-border bg-background"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-semibold uppercase tracking-widest ${
                        program.isDefault ? "text-primary" : "text-text-secondary"
                      }`}
                    >
                      {badgeLabel}
                    </Text>
                  </View>
                </View>

                <Text className="text-text-muted text-sm" numberOfLines={2}>
                  {program.description || "Fără descriere adăugată încă."}
                </Text>

                <View className="flex-row items-center gap-3 mt-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="repeat-outline" size={16} color="#A3ADC8" />
                    <Text className="text-text-secondary text-xs font-semibold">
                      {program.sessionsPerWeek}x/săpt
                    </Text>
                  </View>
                  {typeof program.durationWeeks === "number" && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="calendar-outline" size={16} color="#A3ADC8" />
                      <Text className="text-text-secondary text-xs font-semibold">
                        {program.durationWeeks} săpt
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Animated.View style={chevronAnimatedStyle} className="self-end">
                <Ionicons name="chevron-down" size={20} color="#A3ADC8" />
              </Animated.View>
            </Pressable>

            <Animated.View style={expandAnimatedStyle}>
              <View className="mt-3 border-t border-border/60 pt-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-text-secondary text-xs uppercase tracking-wider">
                    Structură
                  </Text>
                  <Text className="text-text-muted text-xs">
                    {program.sessionsPerWeek} zile / săpt
                  </Text>
                </View>

                {sessions.map((session, index) => (
                  <View key={session.id} className="flex-row items-start gap-3 py-2">
                    <View className="w-9 h-9 rounded-xl bg-background border border-border items-center justify-center">
                      <Text className="text-primary font-semibold">
                        {DAY_BADGES[index] || session.dayNumber}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-primary font-semibold">
                        {session.name}
                      </Text>
                      <Text className="text-text-secondary text-xs mt-1">
                        {session.focus}
                      </Text>
                      {session.notes ? (
                        <Text className="text-text-muted text-[11px] mt-1">
                          {session.notes}
                        </Text>
                      ) : null}
                    </View>
                    <Text className="text-text-muted text-xs mt-1">
                      Ziua {session.dayNumber}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            <View className="flex-row gap-3 mt-4">
              {onEdit && !program.isDefault && (
                <Button
                  label="Editează"
                  variant="outline"
                  onPress={() => onEdit(program)}
                  className="flex-1"
                />
              )}
              {onAssign && (
                <Button
                  label="Asignează client"
                  onPress={() => onAssign(program)}
                  className="flex-1"
                />
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
