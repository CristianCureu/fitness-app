import {
  EmptySchedule,
  ScheduleFilters,
  SessionCard,
  SessionModal,
  WeekNavigator,
} from "@/components/schedule";
import { Button } from "@/components/ui/button";
import { useClients } from "@/lib/hooks/queries/use-clients";
import {
  useCreateSession,
  useDeleteSession,
  useSessions,
  useUpdateSession,
  useUpdateSessionStatus,
} from "@/lib/hooks/queries/use-sessions";
import { useAppUser } from "@/lib/stores/auth-store";
import type { CreateSessionDto, ScheduledSession, SessionStatus } from "@/lib/types/api";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

dayjs.extend(isoWeek);

export default function ScheduleScreen() {
  const appUser = useAppUser();
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [selectedClientId, setSelectedClientId] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduledSession>();
  const [showFilters, setShowFilters] = useState(false);

  const startOfWeek = currentWeek.startOf("isoWeek");
  const endOfWeek = currentWeek.endOf("isoWeek");

  const sessionsQuery = useSessions({
    startDate: startOfWeek.toISOString(),
    endDate: endOfWeek.toISOString(),
    clientId: selectedClientId,
    status: selectedStatus,
  });

  const clientsQuery = useClients();
  const clients = clientsQuery.data?.data || [];

  const createSessionMutation = useCreateSession();
  const updateSessionMutation = useUpdateSession();
  const updateSessionStatusMutation = useUpdateSessionStatus();
  const deleteSessionMutation = useDeleteSession();

  const sessions = sessionsQuery.data?.data || [];
  const totalSessions = sessionsQuery.data?.total || 0;
  const daySessions = useMemo(() => {
    if (viewMode !== "day") return sessions;
    return sessions.filter((session) =>
      dayjs(session.startAt).isSame(selectedDay, "day")
    );
  }, [sessions, selectedDay, viewMode]);

  const trainerName =
    appUser?.trainerProfile?.firstName || appUser?.clientProfile?.firstName || "Trainer";

  const goToPreviousWeek = () => setCurrentWeek(currentWeek.subtract(1, "week"));
  const goToNextWeek = () => setCurrentWeek(currentWeek.add(1, "week"));
  const goToThisWeek = () => setCurrentWeek(dayjs());
  const goToPreviousDay = () => setSelectedDay(selectedDay.subtract(1, "day"));
  const goToNextDay = () => setSelectedDay(selectedDay.add(1, "day"));
  const goToToday = () => setSelectedDay(dayjs());

  const handleAddSession = () => {
    setEditingSession(undefined);
    setIsModalVisible(true);
  };

  const handleEditSession = (session: ScheduledSession) => {
    setEditingSession(session);
    setIsModalVisible(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert("Șterge sesiune", "Sigur vrei să ștergi această sesiune?", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Șterge",
        style: "destructive",
        onPress: () => {
          deleteSessionMutation.mutate(sessionId);
        },
      },
    ]);
  };

  const handleStatusChange = (sessionId: string, status: SessionStatus) => {
    updateSessionStatusMutation.mutate(
      { id: sessionId, status },
      {
        onError: (error) => {
          console.error("❌ Status change handler - error:", error);
          Alert.alert("Eroare", "Nu am putut actualiza statusul sesiunii");
        },
      }
    );
  };

  const handleSaveSession = (data: CreateSessionDto) => {
    if (editingSession) {
      const { clientId, ...dataToSend } = data;
      updateSessionMutation.mutate(
        { id: editingSession.id, data: dataToSend },
        {
          onSuccess: () => {
            setIsModalVisible(false);
            setEditingSession(undefined);
          },
          onError: (error) => {
            console.log(error.message);
          },
        }
      );
    } else {
      createSessionMutation.mutate(data, {
        onSuccess: () => {
          setIsModalVisible(false);
        },
        onError: (error) => {
          console.log(error.message);
        },
      });
    }
  };

  const handleSessionPress = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      handleEditSession(session);
    }
  };

  const activeFiltersCount = (selectedClientId ? 1 : 0) + (selectedStatus ? 1 : 0);

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        refreshControl={
          <RefreshControl
            refreshing={sessionsQuery.isRefetching}
            onRefresh={() => sessionsQuery.refetch()}
            tintColor="#f798af"
          />
        }
      >
        <View className="px-6 pt-16 pb-6">
          <Text className="text-text-secondary text-sm mb-1">Panou trainer</Text>
          <Text className="text-text-primary text-3xl font-bold">
            Programări, {trainerName}
          </Text>
          <Text className="text-text-muted text-sm mt-2">
            {totalSessions || 0} sesiuni {activeFiltersCount > 0 && "filtrate"}
          </Text>

          <View className="flex-row gap-3 mt-5">
            <Button
              label="Adaugă sesiune"
              variant="outline"
              onPress={handleAddSession}
              iconName="add-circle-outline"
              className="flex-1"
            />
            <Button
              label={`Filtre${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}`}
              variant="ghost"
              onPress={() => setShowFilters(!showFilters)}
              iconName="options-outline"
              className="w-32"
            />
          </View>
          <View className="flex-row gap-3 mt-3">
            <Button
              label="Săptămână"
              variant={viewMode === "week" ? "secondary" : "ghost"}
              onPress={() => setViewMode("week")}
              iconName="calendar-outline"
              className="flex-1"
            />
            <Button
              label="Zi"
              variant={viewMode === "day" ? "secondary" : "ghost"}
              onPress={() => setViewMode("day")}
              iconName="time-outline"
              className="flex-1"
            />
          </View>
        </View>

        {/* Week Navigation */}
        {viewMode === "week" ? (
          <View className="px-6 mb-4">
            <WeekNavigator
              currentWeek={currentWeek}
              startOfWeek={startOfWeek}
              endOfWeek={endOfWeek}
              onPrevious={goToPreviousWeek}
              onNext={goToNextWeek}
              onToday={goToThisWeek}
              isCurrentWeek={currentWeek.isSame(dayjs(), "week")}
            />
          </View>
        ) : (
          <View className="px-6 mb-4">
            <View className="bg-surface border border-border rounded-2xl p-4 flex-row items-center justify-between">
              <Button
                label=" "
                variant="ghost"
                onPress={goToPreviousDay}
                iconName="chevron-back"
                className="w-12"
              />
              <View className="flex-1 items-center">
                <Text className="text-text-primary text-lg font-semibold">
                  {selectedDay.format("dddd, D MMMM YYYY")}
                </Text>
                {!selectedDay.isSame(dayjs(), "day") && (
                  <Button
                    label="Azi"
                    variant="ghost"
                    onPress={goToToday}
                    iconName="time-outline"
                    className="mt-2"
                  />
                )}
              </View>
              <Button
                label=" "
                variant="ghost"
                onPress={goToNextDay}
                iconName="chevron-forward"
                className="w-12"
              />
            </View>
          </View>
        )}

        {/* Filters */}
        {showFilters && (
          <View className="px-6">
            <ScheduleFilters
              selectedClientId={selectedClientId}
              selectedStatus={selectedStatus}
              onClientChange={setSelectedClientId}
              onStatusChange={setSelectedStatus}
              clients={clients}
            />
          </View>
        )}

        {/* Calendar Content */}
        <View className="px-6 mb-10">
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
            {viewMode === "day" ? "Sesiuni pentru ziua selectată" : "Sesiuni programate"}
          </Text>

          {sessionsQuery.isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator color="#f798af" />
              <Text className="text-text-muted text-sm mt-3">
                Se încarcă sesiunile...
              </Text>
            </View>
          ) : sessionsQuery.isError ? (
            <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <Text className="text-red-400 text-sm">
                Nu am putut încărca sesiunile. Trage în jos pentru refresh.
              </Text>
            </View>
          ) : daySessions.length ? (
            <View>
              {daySessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onPress={() => handleSessionPress(session.id)}
                  onStatusChange={(status: SessionStatus) =>
                    handleStatusChange(session.id, status)
                  }
                  onDelete={() => handleDeleteSession(session.id)}
                />
              ))}
            </View>
          ) : (
            <EmptySchedule onAddSession={handleAddSession} />
          )}
        </View>
      </ScrollView>

      {/* Session Modal */}
      <SessionModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingSession(undefined);
        }}
        onSave={handleSaveSession}
        clients={clients}
        session={editingSession}
        loading={createSessionMutation.isPending || updateSessionMutation.isPending}
      />
    </>
  );
}
