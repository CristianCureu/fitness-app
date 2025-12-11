import type { ScheduledSession, SessionStatus } from "@/lib/types/api";
import { colors } from "@/lib/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SessionStatusBadge } from "./SessionStatusBadge";

interface SessionCardProps {
  session: ScheduledSession;
  onPress: () => void;
  onStatusChange: (status: SessionStatus) => void;
  onDelete: () => void;
}

export const SESSION_STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  SCHEDULED: {
    label: "Programată",
    bg: colors.sessionScheduledBg,
    text: colors.sessionScheduled,
    icon: "calendar-outline",
  },
  COMPLETED: {
    label: "Finalizată",
    bg: colors.sessionCompletedBg,
    text: colors.sessionCompleted,
    icon: "checkmark-circle-outline",
  },
  CANCELLED: {
    label: "Anulată",
    bg: colors.sessionCancelledBg,
    text: colors.sessionCancelled,
    icon: "close-circle-outline",
  },
  NO_SHOW: {
    label: "Absent",
    bg: colors.sessionNoShowBg,
    text: colors.sessionNoShow,
    icon: "alert-circle-outline",
  },
};

// Backwards compatibility alias
export const STATUS_STYLES = SESSION_STATUS_CONFIG;

export const SESSION_STATUS_OPTIONS: {
  label: string;
  value: SessionStatus;
  icon: string;
  color: string;
}[] = [
  {
    label: SESSION_STATUS_CONFIG.SCHEDULED.label,
    value: "SCHEDULED",
    icon: SESSION_STATUS_CONFIG.SCHEDULED.icon,
    color: SESSION_STATUS_CONFIG.SCHEDULED.text,
  },
  {
    label: SESSION_STATUS_CONFIG.COMPLETED.label,
    value: "COMPLETED",
    icon: SESSION_STATUS_CONFIG.COMPLETED.icon,
    color: SESSION_STATUS_CONFIG.COMPLETED.text,
  },
  {
    label: SESSION_STATUS_CONFIG.CANCELLED.label,
    value: "CANCELLED",
    icon: SESSION_STATUS_CONFIG.CANCELLED.icon,
    color: SESSION_STATUS_CONFIG.CANCELLED.text,
  },
  {
    label: SESSION_STATUS_CONFIG.NO_SHOW.label,
    value: "NO_SHOW",
    icon: SESSION_STATUS_CONFIG.NO_SHOW.icon,
    color: SESSION_STATUS_CONFIG.NO_SHOW.text,
  },
];

// Backwards compatibility alias
export const STATUS_OPTIONS = SESSION_STATUS_OPTIONS;

export function SessionCard({ session, onPress, onStatusChange, onDelete }: SessionCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const startTime = dayjs(session.startAt);
  const endTime = dayjs(session.endAt);
  const client = session.client;

  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = -80;
  const isSwipeActive = useSharedValue(false);

  const handleLongPress = () => {
    setShowStatusMenu(true);
  };

  const handleStatusSelect = (status: SessionStatus) => {
    setShowStatusMenu(false);
    if (status !== session.status) {
      onStatusChange(status);
    }
  };

  const handleDeletePress = () => {
    translateX.value = withSpring(0);
    isSwipeActive.value = false;
    onDelete();
  };

  const handlePress = () => {
    // Only allow press when card is not swiped open
    if (translateX.value === 0 && !isSwipeActive.value) {
      onPress();
    } else if (translateX.value < 0) {
      // If card is swiped open, close it instead of opening modal
      translateX.value = withSpring(0);
      isSwipeActive.value = false;
    }
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
      translateX.value = Math.min(0, Math.max(contextX.value + event.translationX, SWIPE_THRESHOLD));
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

  return (
    <>
      <View className="mb-3 relative overflow-hidden rounded-2xl">
        <View className="absolute right-0 top-0 bottom-0 flex-row">
          <Pressable
            onPress={handleDeletePress}
            className="justify-center items-center w-20 bg-red-500"
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
            <Pressable
              onPress={handlePress}
              onLongPress={handleLongPress}
              className="bg-surface border border-border rounded-2xl p-4"
            >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-text-primary text-base font-semibold">
              {startTime.format("ddd, D MMM")}
            </Text>
            <Text className="text-text-secondary text-sm mt-1">
              {startTime.format("HH:mm")} - {endTime.format("HH:mm")}
            </Text>
          </View>
          <SessionStatusBadge status={session.status} />
        </View>

        <View className="flex-row items-center gap-2 mt-2">
          <Ionicons name="person-outline" size={16} color="#A3ADC8" />
          <Text className="text-text-secondary text-sm">
            {client ? `${client.firstName} ${client.lastName}` : "Client necunoscut"}
          </Text>
        </View>

        <View className="flex-row items-center gap-2 mt-1">
          <Ionicons name="fitness-outline" size={16} color="#A3ADC8" />
          <Text className="text-text-secondary text-sm">{session.sessionType}</Text>
        </View>

        {session.notes && (
          <View className="flex-row items-start gap-2 mt-2 pt-2 border-t border-border/50">
            <Ionicons name="document-text-outline" size={16} color="#A3ADC8" />
            <Text className="text-text-muted text-xs flex-1" numberOfLines={2}>
              {session.notes}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-end mt-2">
          <Ionicons name="chevron-forward" size={18} color="#A3ADC8" />
        </View>
      </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Status Change Menu */}
      <Modal
        visible={showStatusMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowStatusMenu(false)}
        >
          <View className="bg-surface rounded-t-3xl p-6">
            <Text className="text-text-primary text-lg font-semibold mb-4">
              Schimbă statusul
            </Text>

            <View className="gap-2">
              {STATUS_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleStatusSelect(option.value)}
                  className={`flex-row items-center gap-3 p-4 rounded-xl ${
                    session.status === option.value
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-background border border-border"
                  }`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={option.color}
                  />
                  <Text
                    className={`text-base flex-1 ${
                      session.status === option.value
                        ? "text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {session.status === option.value && (
                    <Ionicons name="checkmark" size={24} color="#f798af" />
                  )}
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => setShowStatusMenu(false)}
              className="mt-4 p-4 bg-background rounded-xl"
            >
              <Text className="text-text-secondary text-center text-base">
                Anulează
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
