import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  FlatList,
} from 'react-native';
import { useState } from 'react';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSessionHistory } from '@/lib/hooks/queries/use-sessions';
import type { ScheduledSession } from '@/lib/types/api';

const ITEMS_PER_PAGE = 20;

export default function SessionHistoryScreen() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);

  const historyQuery = useSessionHistory(ITEMS_PER_PAGE, offset);

  const sessions = historyQuery.data?.data || [];
  const total = historyQuery.data?.total || 0;
  const hasMore = offset + ITEMS_PER_PAGE < total;

  if (!historyQuery.isLoading) {
    console.log('[History] loaded', {
      total,
      returned: sessions.length,
      offset,
    });
  }

  const loadMore = () => {
    if (!historyQuery.isLoading && hasMore) {
      setOffset((prev) => prev + ITEMS_PER_PAGE);
    }
  };

  const renderSessionItem = ({ item }: { item: ScheduledSession }) => {
    const completedDate = item.completedAt ? dayjs(item.completedAt) : null;
    const dateFormatted = completedDate
      ? completedDate.format('D MMMM YYYY')
      : '';
    const timeFormatted = completedDate ? completedDate.format('HH:mm') : '';

    return (
      <Pressable
        onPress={() => router.push(`/session/${item.id}` as any)}
        className="bg-surface border border-border rounded-xl p-4 mb-3 active:opacity-80"
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text className="text-text-primary text-lg font-semibold mb-1">
              {item.sessionName}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color="#34D399" />
              <Text className="text-text-secondary text-sm ml-1 capitalize">
                {dateFormatted} • {timeFormatted}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A3ADC8" />
        </View>

        {item.sessionType && (
          <View className="bg-background px-3 py-1 rounded-full self-start mt-2">
            <Text className="text-text-secondary text-xs">{item.sessionType}</Text>
          </View>
        )}

        {item.notes && (
          <View className="mt-3 bg-background p-3 rounded-lg">
            <Text className="text-text-secondary text-sm">{item.notes}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!historyQuery.isLoading) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#f798af" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (historyQuery.isLoading) {
      return (
        <View className="bg-surface border border-border rounded-xl p-6 items-center">
          <ActivityIndicator size="large" color="#f798af" />
        </View>
      );
    }

    return (
      <View className="bg-surface border border-border rounded-xl p-6 items-center">
        <Text className="text-text-secondary text-sm">
          Nu ai sesiuni completate încă
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 bg-surface border-b border-border">
        <Pressable onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#E8ECF5" />
        </Pressable>

        <Text className="text-text-primary text-3xl font-bold mb-2">
          Istoric Sesiuni
        </Text>

        <Text className="text-text-secondary text-sm">
          {total} {total === 1 ? 'sesiune completată' : 'sesiuni completate'}
        </Text>
      </View>

      {/* Sessions List */}
      <FlatList
        data={sessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}
