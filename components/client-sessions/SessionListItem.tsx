import { View, Text, Pressable } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { ScheduledSession } from '@/lib/types/api';
import { Ionicons } from '@expo/vector-icons';

interface SessionListItemProps {
  session: ScheduledSession;
  onPress: () => void;
  clientTimezone?: string;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export function SessionListItem({ session, onPress, clientTimezone }: SessionListItemProps) {
  const timezoneName = clientTimezone || dayjs.tz.guess() || 'UTC';
  const sessionDate = dayjs(session.startAt).tz(timezoneName);
  const dayName = sessionDate.format('dddd');
  const timeFormatted = sessionDate.format('HH:mm');

  const getStatusColor = () => {
    switch (session.status) {
      case 'COMPLETED':
        return 'text-session-completed';
      case 'CANCELLED':
        return 'text-session-cancelled';
      case 'NO_SHOW':
        return 'text-session-no-show';
      default:
        return 'text-session-scheduled';
    }
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'COMPLETED':
        return 'bg-session-completed';
      case 'CANCELLED':
        return 'bg-session-cancelled';
      case 'NO_SHOW':
        return 'bg-session-no-show';
      default:
        return 'bg-session-scheduled';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-surface border border-border rounded-xl p-4 mb-3 active:opacity-80"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View className={`w-1 h-12 rounded-full mr-3 ${getStatusBadge()}`} />
          <View className="flex-1">
            <Text className="text-text-primary text-lg font-semibold capitalize">
              {dayName}
            </Text>
            <Text className="text-text-secondary text-sm">
              {timeFormatted} • {session.sessionName}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#A3ADC8" />
      </View>

      {session.sessionType && (
        <View className="flex-row items-center mt-2">
          <View className="bg-background px-3 py-1 rounded-full">
            <Text className="text-text-secondary text-xs">
              {session.sessionType}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
