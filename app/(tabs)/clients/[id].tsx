import {
  ActiveProgramSection,
  ClientDetailHeader,
  NutritionSection,
} from "@/components/clients/[id]";
import { AssignProgramModal, ProgramPickerModal } from "@/components/programs";
import { useClient } from "@/lib/hooks/queries/use-clients";
import {
  useActiveClientProgram,
  useAssignProgram,
  usePrograms,
  useRemoveProgramAssignment,
  useUpdateProgram,
  useUpdateTrainingDays,
} from "@/lib/hooks/queries/use-programs";
import type { DayOfWeek, Program, UpdateProgramRequest } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const clientQuery = useClient(clientId || "");
  const router = useRouter();
  const programsQuery = usePrograms();
  const activeProgramQuery = useActiveClientProgram(clientId);
  const assignProgramMutation = useAssignProgram();
  const updateProgramMutation = useUpdateProgram();
  const updateTrainingDaysMutation = useUpdateTrainingDays();
  const removeProgramMutation = useRemoveProgramAssignment();

  const [selectedProgram, setSelectedProgram] = useState<{
    id: string;
    name: string;
    sessionsPerWeek?: number;
  } | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProgramPicker, setShowProgramPicker] = useState(false);
  const [defaultCustomize, setDefaultCustomize] = useState(false);

  const client = clientQuery.data;
  const activeProgram = activeProgramQuery.data || null;

  if (!clientId) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-primary">Client ID lipsă</Text>
      </View>
    );
  }

  if (clientQuery.isLoading || !client) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#f798af" />
        <Text className="text-text-muted text-sm mt-3">
          Încărcăm profilul clientului...
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

  const handleSelectProgram = (program: Program, customize = false) => {
    setSelectedProgram({
      id: program.id,
      name: program.name,
      sessionsPerWeek: program.sessionsPerWeek,
    });
    setDefaultCustomize(customize);
    setShowAssignModal(true);
  };

  const handleUpdateProgram = (data: UpdateProgramRequest, trainingDays?: DayOfWeek[]) => {
    if (!activeProgram?.program.id || !clientId) return;

    // Update program details
    updateProgramMutation.mutate(
      { id: activeProgram.program.id, data },
      {
        onSuccess: () => {
          // If training days were also changed, update them
          if (trainingDays && trainingDays.length > 0) {
            updateTrainingDaysMutation.mutate(
              { clientId, data: { trainingDays } },
              {
                onError: (error: any) => {
                  Alert.alert("Eroare", error.message || "Nu am putut actualiza zilele de antrenament.");
                },
              }
            );
          }
        },
        onError: (error: any) => {
          Alert.alert("Eroare", error.message || "Nu am putut actualiza programul.");
        },
      }
    );
  };

  const handleRemoveProgram = () => {
    if (!clientId) return;

    removeProgramMutation.mutate(clientId, {
      onSuccess: (data) => {
        Alert.alert("Success", data.message);
      },
      onError: (error) => {
        Alert.alert("Eroare", error.message || "Nu am putut elimina programul.");
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <ClientDetailHeader client={client} />

      <View className="px-6 pt-6 pb-10">
        <ActiveProgramSection
          client={client}
          activeProgram={activeProgram}
          onAssignPress={() => {
            setShowProgramPicker(true);
            setDefaultCustomize(false);
          }}
          onUpdateProgram={handleUpdateProgram}
          updatingProgram={updateProgramMutation.isPending || updateTrainingDaysMutation.isPending}
          onRemove={activeProgram ? handleRemoveProgram : undefined}
          removing={removeProgramMutation.isPending}
        />

        <NutritionSection client={client} />

        <Pressable
          onPress={() =>
            router.push({ pathname: "/(tabs)/clients/[id]/details", params: { id: client.id } })
          }
          className="bg-surface border border-border rounded-2xl p-5 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/40 items-center justify-center">
                <Ionicons name="layers-outline" size={20} color="#f798af" />
              </View>
              <View>
                <Text className="text-text-primary font-semibold">Detalii client</Text>
                <Text className="text-text-muted text-sm">
                  Istoric, onboarding, recomandari si note
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A3ADC8" />
          </View>
        </Pressable>
      </View>

      <ProgramPickerModal
        visible={showProgramPicker}
        programs={programsQuery.data || []}
        loading={programsQuery.isLoading}
        onSelect={(program) => {
          setShowProgramPicker(false);
          handleSelectProgram(program);
        }}
        onClose={() => setShowProgramPicker(false)}
      />

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
