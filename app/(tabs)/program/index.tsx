import { ScrollView, Text, View, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Ionicons } from '@expo/vector-icons';
import { WeekCalendar, SessionListItem } from '@/components/client-sessions';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import Button from '@/components/ui/button';
import {
  useWeekCalendar,
  useCreateClientSession,
  useClientSessionRecommendation,
} from '@/lib/hooks/queries/use-sessions';
import { useTodayView } from '@/lib/hooks/queries/use-today';
import { useRouter } from 'expo-router';
import { useAppUser } from '@/lib/stores/auth-store';
import type { ScheduledSession } from '@/lib/types/api';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ProgramScreen() {
  const router = useRouter();
  const appUser = useAppUser();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDaySessions, setSelectedDaySessions] = useState<ScheduledSession[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const [recommendedSession, setRecommendedSession] = useState<{
    name: string;
    type: string;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const clientTimezone =
    appUser?.clientProfile?.timezone || dayjs.tz.guess() || 'UTC';

  const [weekStart, setWeekStart] = useState<Dayjs>(
    dayjs().tz(clientTimezone).startOf('isoWeek')
  );
  const weekCalendarQuery = useWeekCalendar(weekStart.format('YYYY-MM-DD'));
  const todayQuery = useTodayView();
  const createClientSession = useCreateClientSession();
  const recommendationMutation = useClientSessionRecommendation();

  useEffect(() => {
    setWeekStart(dayjs().tz(clientTimezone).startOf('isoWeek'));
  }, [clientTimezone]);

  const sessions = weekCalendarQuery.data?.sessions || [];

  // Filter only scheduled sessions
  const scheduledSessions = sessions.filter((s) => s.status === 'SCHEDULED');

  const handleDayPress = (date: Date, daySessions: ScheduledSession[]) => {
    setSelectedDate(date);
    setSelectedDaySessions(daySessions.filter((s) => s.status === 'SCHEDULED'));
  };

  const handleSessionPress = (sessionId: string) => {
    router.push(`/session/${sessionId}` as any);
  };

  const handleRefresh = () => {
    weekCalendarQuery.refetch();
  };

  const handleViewHistory = () => {
    router.push('/program/history' as any);
  };

  const nutritionTip = todayQuery.data?.nutritionTip?.text;

  const ensureRecommendation = async () => {
    if (recommendedSession) {
      return recommendedSession;
    }
    if (recommendationMutation.data) {
      const cached = {
        name: recommendationMutation.data.sessionName,
        type: recommendationMutation.data.sessionType,
      };
      setRecommendedSession(cached);
      return cached;
    }
    try {
      const data = await recommendationMutation.mutateAsync();
      const next = { name: data.sessionName, type: data.sessionType };
      setRecommendedSession(next);
      return next;
    } catch (error) {
      console.error('Failed to load recommendation', {
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };

  const confirmSchedule = async () => {
    if (!scheduledFor) {
      return;
    }
    setScheduleError(null);
    setConfirming(true);
    try {
      await ensureRecommendation();
      createClientSession.mutate(
        {
          startAt: dayjs
            .tz(dayjs(scheduledFor).format('YYYY-MM-DD HH:mm'), clientTimezone)
            .toISOString(),
        },
        {
          onSuccess: () => {
            console.log('[Schedule] client session created');
            setScheduledFor(null);
            setRecommendedSession(null);
            setScheduleError(null);
          },
          onError: (error) => {
            console.log('[Schedule] create error', {
              message: error instanceof Error ? error.message : String(error),
            });
            setScheduleError(
              error instanceof Error ? error.message : 'Nu am putut salva sesiunea.',
            );
          },
          onSettled: () => {
            setConfirming(false);
          },
        }
      );
    } catch {
      setConfirming(false);
      setScheduleError('Nu am putut obtine recomandarea.');
    }
  };

  const sessionSummary = useMemo(() => {
    if (!scheduledFor) return '';
    return dayjs(scheduledFor).tz(clientTimezone).format('DD MMM YYYY, HH:mm');
  }, [scheduledFor, clientTimezone]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={weekCalendarQuery.isRefetching}
          onRefresh={handleRefresh}
          tintColor="#f798af"
        />
      }
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text className="text-text-primary text-3xl font-bold">
              Programul Meu
            </Text>
            <Text className="text-text-secondary text-sm mt-1">
              Vezi sesiunile tale programate
            </Text>
          </View>
          <Pressable
            onPress={handleViewHistory}
            className="bg-surface border border-border rounded-xl p-3 active:opacity-80"
          >
            <Ionicons name="time-outline" size={24} color="#f798af" />
          </Pressable>
        </View>
      </View>

      {/* Schedule Session */}
      <View className="px-6 mb-6">
        <View className="bg-surface border border-border rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="add-circle-outline" size={18} color="#f798af" />
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
                Programeaza o sesiune
              </Text>
            </View>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40"
            >
              <Text className="text-primary text-xs font-semibold">Selecteaza ziua</Text>
            </Pressable>
          </View>

          {scheduledFor ? (
            <View className="bg-background border border-border rounded-xl p-4">
              <Text className="text-text-secondary text-xs uppercase tracking-wider">
                Programare
              </Text>
              <Text className="text-text-primary text-base mt-1">{sessionSummary}</Text>
              {recommendationMutation.isPending ? (
                <Text className="text-text-muted text-sm mt-2">Cautam recomandarea...</Text>
              ) : recommendedSession ? (
                <View className="mt-3">
                  <Text className="text-text-secondary text-xs uppercase tracking-wider">
                    Recomandare antrenament
                  </Text>
                  <Text className="text-text-primary text-sm mt-1">
                    {recommendedSession.name} ({recommendedSession.type})
                  </Text>
                </View>
              ) : recommendationMutation.isError ? (
                <View className="mt-3">
                  <Text className="text-red-400 text-sm">
                    Nu am putut incarca recomandarea.
                  </Text>
                  <Pressable
                    onPress={() => {
                      recommendationMutation.mutate(undefined, {
                        onSuccess: (data) => {
                          setRecommendedSession({
                            name: data.sessionName,
                            type: data.sessionType,
                          });
                        },
                        onError: (error) => {
                          console.error('Recommendation request failed', {
                            message: error instanceof Error ? error.message : String(error),
                          });
                        },
                      });
                    }}
                    className="mt-2 self-start px-3 py-1 rounded-full border border-primary/40 bg-primary/15"
                  >
                    <Text className="text-primary text-xs font-semibold">Reincearca</Text>
                  </Pressable>
                </View>
              ) : (
                <Text className="text-text-muted text-sm mt-2">
                  Recomandarea va fi afisata aici.
                </Text>
              )}

              {nutritionTip ? (
                <View className="mt-3 flex-row items-start gap-2">
                  <Ionicons name="leaf-outline" size={16} color="#7be495" />
                  <Text className="text-text-secondary text-sm flex-1">{nutritionTip}</Text>
                </View>
              ) : null}

              {scheduleError ? (
                <View className="mt-3 bg-red-500/10 border border-red-500/40 rounded-xl p-3">
                  <Text className="text-red-300 text-sm">{scheduleError}</Text>
                </View>
              ) : null}

              <View className="mt-4">
                <Button
                  label="Confirma sesiunea"
                  onPress={confirmSchedule}
                  loading={confirming}
                  disabled={confirming}
                  iconName="checkmark-circle-outline"
                  fullWidth
                />
              </View>
            </View>
          ) : (
            <Text className="text-text-muted text-sm">
              Selecteaza o zi si o ora, apoi primesti recomandarea automat.
            </Text>
          )}
        </View>
      </View>

      {/* Week Calendar */}
      <View className="px-6 mb-6">
        <WeekCalendar
          sessions={sessions}
          onDayPress={handleDayPress}
          loading={weekCalendarQuery.isLoading}
          weekStart={weekStart}
          onWeekChange={setWeekStart}
          clientTimezone={clientTimezone}
        />
      </View>

      {/* Selected Day Sessions */}
      {selectedDate && selectedDaySessions.length > 0 && (
        <View className="px-6 mb-6">
          <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
            Sesiuni pentru {dayjs(selectedDate).tz(clientTimezone).format('D MMMM YYYY')}
          </Text>
          {selectedDaySessions.map((session) => (
            <SessionListItem
              key={session.id}
              session={session}
              onPress={() => handleSessionPress(session.id)}
              clientTimezone={clientTimezone}
            />
          ))}
        </View>
      )}

      {/* All Scheduled Sessions */}
      <View className="px-6 mb-6">
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Sesiuni Programate
        </Text>

        {weekCalendarQuery.isLoading ? (
          <View className="bg-surface border border-border rounded-xl p-6 items-center">
            <ActivityIndicator size="large" color="#f798af" />
          </View>
        ) : scheduledSessions.length === 0 ? (
          <View className="bg-surface border border-border rounded-xl p-6 items-center">
            <Text className="text-text-secondary text-sm">
              Nu ai sesiuni programate săptămâna aceasta
            </Text>
          </View>
        ) : (
          scheduledSessions.map((session) => (
            <SessionListItem
              key={session.id}
              session={session}
              onPress={() => handleSessionPress(session.id)}
              clientTimezone={clientTimezone}
            />
          ))
        )}
      </View>

      <DateTimePicker
        visible={showDatePicker}
        value={scheduledFor || new Date()}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setScheduledFor(date);
          setRecommendedSession(null);
          recommendationMutation.reset();
          recommendationMutation.mutate(undefined, {
            onSuccess: (data) => {
              setRecommendedSession({ name: data.sessionName, type: data.sessionType });
            },
            onError: (error) => {
              console.error('Recommendation request failed', {
                message: error instanceof Error ? error.message : String(error),
              });
            },
          });
        }}
        onCancel={() => setShowDatePicker(false)}
        title="Alege ziua si ora"
      />
    </ScrollView>
  );
}
