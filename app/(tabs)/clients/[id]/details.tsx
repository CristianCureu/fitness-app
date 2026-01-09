import {
  ClientDetailHeader,
  GoalSection,
  ImpersonateButton,
  NotesSection,
  OnboardingInfoSection,
  ProgramHistorySection,
  RecommendationsSection,
} from "@/components/clients/[id]";
import { AssignProgramModal } from "@/components/programs";
import { useClient } from "@/lib/hooks/queries/use-clients";
import {
  useActiveClientProgram,
  useAssignProgram,
  useProgramHistory,
  useProgramRecommendations,
} from "@/lib/hooks/queries/use-programs";
import type { DayOfWeek } from "@/lib/types/api";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const clientQuery = useClient(clientId || "");
  const activeProgramQuery = useActiveClientProgram(clientId);
  const recommendationsQuery = useProgramRecommendations(clientId);
  const historyQuery = useProgramHistory(clientId);
  const assignProgramMutation = useAssignProgram();

  const [selectedProgram, setSelectedProgram] = useState<{
    id: string;
    name: string;
    sessionsPerWeek?: number;
  } | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [defaultCustomize, setDefaultCustomize] = useState(false);

  const client = clientQuery.data;
  const activeProgram =
    activeProgramQuery.data || recommendationsQuery.data?.currentProgram || null;

  if (!clientId) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-primary">Client ID lipsa</Text>
      </View>
    );
  }

  if (clientQuery.isLoading || !client) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#f798af" />
        <Text className="text-text-muted text-sm mt-3">
          Incarcam profilul clientului...
        </Text>
      </View>
    );
  }

  const handleAssign = ({
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
          setDefaultCustomize(false);
          setSelectedProgram(null);
        },
        onError: (error) => {
          Alert.alert("Eroare", error.message || "Nu am putut asigna programul.");
        },
      }
    );
  };

  const handleRecommendationAssign = ({
    programId,
    programName,
    customize,
  }: {
    programId: string;
    programName: string;
    customize?: boolean;
  }) => {
    setSelectedProgram({ id: programId, name: programName });
    setDefaultCustomize(Boolean(customize));
    setShowAssignModal(true);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <ClientDetailHeader client={client} />

      <View className="px-6 pt-6 pb-10">
        <Text className="text-text-secondary text-xs uppercase tracking-widest mb-3">
          Detalii client
        </Text>
        <RecommendationsSection
          recommendations={recommendationsQuery.data?.recommendations}
          clientStats={recommendationsQuery.data?.clientStats}
          currentProgram={activeProgram}
          loading={recommendationsQuery.isLoading}
          onAssign={handleRecommendationAssign}
        />

        <ProgramHistorySection
          history={historyQuery.data?.history}
          loading={historyQuery.isLoading}
        />

        <GoalSection client={client} />
        <OnboardingInfoSection client={client} />
        <NotesSection client={client} />
        <ImpersonateButton clientId={client.id} />
      </View>

      <AssignProgramModal
        visible={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedProgram(null);
          setDefaultCustomize(false);
        }}
        program={selectedProgram || undefined}
        clients={[client]}
        defaultClientId={client.id}
        clientLocked
        defaultCustomize={defaultCustomize}
        onConfirm={handleAssign}
        loading={assignProgramMutation.isPending}
      />
    </ScrollView>
  );
}
