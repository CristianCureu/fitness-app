import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { ScheduledSession } from '@/lib/types/api';
import Ionicons from '@expo/vector-icons/Ionicons';

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

interface WeekCalendarProps {
  sessions: ScheduledSession[];
  onDayPress: (date: Date, daySessions: ScheduledSession[]) => void;
  loading?: boolean;
  weekStart: Dayjs;
  onWeekChange: (weekStart: Dayjs) => void;
  clientTimezone?: string;
}

export function WeekCalendar({
  sessions,
  onDayPress,
  loading,
  weekStart,
  onWeekChange,
  clientTimezone,
}: WeekCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const timezoneName = clientTimezone || dayjs.tz.guess() || 'UTC';

  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));
  const weekEnd = weekStart.add(6, 'day');
  const isCurrentWeek = weekStart.isSame(dayjs().tz(timezoneName).startOf('isoWeek'), 'day');

  const getSessionsForDay = (date: Dayjs) => {
    return sessions.filter((session) =>
      dayjs(session.startAt).tz(timezoneName).isSame(date, 'day')
    );
  };

  useEffect(() => {
    if (!selectedDate) return;
    const inWeek = selectedDate.isAfter(weekStart.subtract(1, 'day')) &&
      selectedDate.isBefore(weekEnd.add(1, 'day'));
    if (!inWeek) {
      setSelectedDate(null);
    }
  }, [selectedDate, weekStart, weekEnd]);

  const handleDayPress = (date: Dayjs) => {
    setSelectedDate(date);
    const daySessions = getSessionsForDay(date);
    onDayPress(date.toDate(), daySessions);
  };

  if (loading) {
    return (
      <View className="bg-surface p-4 rounded-2xl border border-border">
        <ActivityIndicator size="large" color="#f798af" />
      </View>
    );
  }

  const monthLabel = `${weekStart.format('D MMM')} - ${weekEnd.format('D MMM YYYY')}`;

  return (
    <View className="bg-surface p-4 rounded-2xl border border-border">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-text-primary text-lg font-semibold">
            Calendar Săptămânal
          </Text>
          <Text className="text-text-secondary text-sm mt-1">{monthLabel}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => onWeekChange(weekStart.subtract(1, 'week'))}
            className="w-9 h-9 rounded-xl bg-background border border-border items-center justify-center"
          >
            <Ionicons name="chevron-back" size={16} color="#A3ADC8" />
          </Pressable>
          <Pressable
            onPress={() => onWeekChange(weekStart.add(1, 'week'))}
            className="w-9 h-9 rounded-xl bg-background border border-border items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={16} color="#A3ADC8" />
          </Pressable>
        </View>
      </View>
      {!isCurrentWeek && (
        <Pressable
          onPress={() => onWeekChange(dayjs().tz(timezoneName).startOf('isoWeek'))}
          className="self-start mb-3 px-3 py-1 rounded-full bg-primary/15 border border-primary/40"
        >
          <Text className="text-primary text-xs font-semibold">Saptamana curenta</Text>
        </Pressable>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {weekDays.map((day, index) => {
            const daySessions = getSessionsForDay(day);
            const hasSession = daySessions.length > 0;
            const isSelected = selectedDate && day.isSame(selectedDate, 'day');
            const isToday = day.isSame(dayjs().tz(timezoneName), 'day');

            const dayName = day.format('ddd').substring(0, 2);
            const dayNumber = day.format('D');
            const monthShort = day.format('MMM');

            return (
              <Pressable
                key={index}
                onPress={() => handleDayPress(day)}
                className={`
                  w-20 py-3 rounded-xl items-center border
                  ${isSelected ? 'bg-primary border-primary' : 'bg-background border-border'}
                  active:opacity-80
                `}
              >
                <Text
                  className={`
                    text-xs font-medium mb-1 uppercase
                    ${isSelected ? 'text-background' : 'text-text-secondary'}
                  `}
                >
                  {dayName}
                </Text>

                <Text
                  className={`
                    text-2xl font-bold
                    ${isSelected ? 'text-background' : isToday ? 'text-primary' : 'text-text-primary'}
                  `}
                >
                  {dayNumber}
                </Text>
                <Text
                  className={`
                    text-xs uppercase mt-1
                    ${isSelected ? 'text-background' : 'text-text-secondary'}
                  `}
                >
                  {monthShort}
                </Text>

                {hasSession && (
                  <View className="mt-2 flex-row items-center gap-2">
                    <View
                      className={`
                        w-2 h-2 rounded-full
                        ${isSelected ? 'bg-background' : 'bg-primary'}
                      `}
                    />
                    <Text
                      className={`
                        text-xs
                        ${isSelected ? 'text-background' : 'text-text-secondary'}
                      `}
                    >
                      {daySessions.length} sesiuni
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
