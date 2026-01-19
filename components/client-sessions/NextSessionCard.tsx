import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { ScheduledSession } from '@/lib/types/api';
import { Ionicons } from '@expo/vector-icons';

interface NextSessionCardProps {
  session: ScheduledSession | null | undefined;
  onViewDetails?: () => void;
  onCancel?: () => void;
  cancelDisabled?: boolean;
  loading?: boolean;
  clientTimezone?: string;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export function NextSessionCard({
  session,
  onViewDetails,
  onCancel,
  cancelDisabled,
  loading,
  clientTimezone,
}: NextSessionCardProps) {
  if (loading) {
    return (
      <View className="bg-surface p-6 rounded-2xl border border-border">
        <ActivityIndicator size="large" color="#f798af" />
      </View>
    );
  }

  if (!session) {
    return (
      <View className="bg-surface p-6 rounded-2xl border border-border">
        <Text className="text-text-secondary text-base text-center">
          Nu ai sesiuni programate în viitorul apropiat
        </Text>
      </View>
    );
  }

  const timezoneName = clientTimezone || dayjs.tz.guess() || 'UTC';
  const sessionDate = dayjs(session.startAt).tz(timezoneName);
  const dayName = sessionDate.format('dddd');
  const dateFormatted = sessionDate.format('D MMMM');
  const timeFormatted = sessionDate.format('HH:mm');

  return (
    <View className="bg-surface p-6 rounded-2xl border border-border">
      <View className="flex-row items-center mb-3">
        <Ionicons name="barbell" size={24} color="#f798af" />
        <Text className="text-text-primary text-lg font-semibold ml-2">
          Următoarea Sesiune
        </Text>
      </View>

      <Text className="text-text-primary text-2xl font-bold mb-1">
        {session.sessionName}
      </Text>

      <View className="flex-row items-center mb-4">
        <Ionicons name="calendar-outline" size={16} color="#A3ADC8" />
        <Text className="text-text-secondary text-base ml-1 capitalize">
          {dayName}, {dateFormatted}
        </Text>
      </View>

      <View className="flex-row items-center mb-6">
        <Ionicons name="time-outline" size={16} color="#A3ADC8" />
        <Text className="text-text-secondary text-base ml-1">
          {timeFormatted}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={onViewDetails}
          className="flex-1 bg-primary py-3 rounded-xl items-center active:opacity-80"
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-background font-semibold text-base">
              Vezi Detalii
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#0F111A" />
          </View>
        </Pressable>

        <Pressable
          onPress={onCancel}
          disabled={!onCancel || cancelDisabled}
          className={`flex-1 bg-surface border border-border py-3 rounded-xl items-center ${
            !onCancel || cancelDisabled ? "opacity-60" : "active:opacity-80"
          }`}
        >
          <Text className="text-text-secondary font-semibold text-base">
            Nu mai pot veni
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
