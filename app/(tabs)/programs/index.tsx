import { AssignProgramModal, ProgramCard } from "@/components/programs";
import { useClients } from "@/lib/hooks/queries/use-clients";
import {
  useAssignProgram,
  useCloneProgram,
  usePrograms,
} from "@/lib/hooks/queries/use-programs";
import { useAppUser } from "@/lib/stores/auth-store";
import type { DayOfWeek, Program } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ProgramsScreen() {
  const appUser = useAppUser();
  const programsQuery = usePrograms();
  const clientsQuery = useClients();
  const assignProgramMutation = useAssignProgram();
  const cloneProgramMutation = useCloneProgram();

  const programs = programsQuery.data || [];
  const clients = clientsQuery.data?.data || [];

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const trainerName =
    appUser?.trainerProfile?.firstName || appUser?.clientProfile?.firstName || "Trainer";

  const handleAssignPress = (program: Program) => {
    setSelectedProgram(program);
    setShowAssignModal(true);
  };

  const handleAssignConfirm = ({
    clientId,
    data,
  }: {
    clientId: string;
    data: {
      programId: string;
      startDate: string;
      trainingDays: DayOfWeek[];
      customize?: boolean;
    };
  }) => {
    assignProgramMutation.mutate(
      { clientId, data },
      {
        onSuccess: () => {
          setShowAssignModal(false);
          setSelectedProgram(null);
        },
        onError: (error) => {
          Alert.alert("Eroare", error.message || "Nu am putut asigna programul.");
        },
      }
    );
  };

  const handleCloneProgram = (program: Program) => {
    cloneProgramMutation.mutate(program.id, {
      onError: (error) => {
        Alert.alert("Eroare", error.message || "Nu am putut clona programul.");
      },
    });
  };

  const isRefreshing = programsQuery.isRefetching || clientsQuery.isRefetching;

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              programsQuery.refetch();
              clientsQuery.refetch();
            }}
            tintColor="#f798af"
          />
        }
      >
        <View className="px-6 pt-16 pb-6">
          <Text className="text-text-secondary text-sm mb-1">Panou trainer</Text>
          <Text className="text-text-primary text-3xl font-bold">
            Programele tale, {trainerName}
          </Text>
          <Text className="text-text-muted text-sm mt-2">
            {programs.length
              ? `${programs.length} template${programs.length > 1 ? "uri" : "u"}`
              : "Niciun program creat încă"}
          </Text>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
            Template-uri programe
          </Text>

          {programsQuery.isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator color="#f798af" />
              <Text className="text-text-muted text-sm mt-3">Încărcăm programele...</Text>
            </View>
          ) : programsQuery.isError ? (
            <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <Text className="text-red-400 text-sm">
                Nu am putut încărca programele. Trage în jos pentru refresh.
              </Text>
            </View>
          ) : programs.length ? (
            programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onAssign={handleAssignPress}
              />
            ))
          ) : (
            <View className="bg-surface border border-border rounded-2xl p-6 items-center">
              <Ionicons name="copy-outline" size={28} color="#A3ADC8" />
              <Text className="text-text-primary text-base font-semibold mt-3">
                Nu există încă programe
              </Text>
              <Text className="text-text-muted text-sm mt-2 text-center">
                Adaugă sau clonează un template default din backend și apoi asignează-l
                clienților tăi.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <AssignProgramModal
        visible={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram || undefined}
        clients={clients}
        onConfirm={handleAssignConfirm}
        loading={assignProgramMutation.isPending}
      />
    </>
  );
}
