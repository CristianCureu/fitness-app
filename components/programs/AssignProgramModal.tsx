import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import type {
  AssignProgramRequest,
  ClientProfile,
  DayOfWeek,
} from "@/lib/types/api";
import dayjs from "dayjs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type MinimalProgram = {
  id: string;
  name: string;
  sessionsPerWeek?: number;
};

interface AssignProgramModalProps {
  visible: boolean;
  onClose: () => void;
  program?: MinimalProgram | null;
  clients: ClientProfile[];
  defaultClientId?: string;
  clientLocked?: boolean;
  defaultCustomize?: boolean;
  loading?: boolean;
  onConfirm: (payload: { clientId: string; data: AssignProgramRequest }) => void;
}

interface AssignFormData {
  clientId: string;
  startDate: Date;
  trainingDays: DayOfWeek[];
  customize: boolean;
}

const DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "Lu" },
  { value: "TUESDAY", label: "Ma" },
  { value: "WEDNESDAY", label: "Mi" },
  { value: "THURSDAY", label: "Jo" },
  { value: "FRIDAY", label: "Vi" },
  { value: "SATURDAY", label: "Sa" },
  { value: "SUNDAY", label: "Du" },
];

function defaultTrainingDays(sessionsPerWeek?: number): DayOfWeek[] {
  const defaults: DayOfWeek[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  if (!sessionsPerWeek || sessionsPerWeek >= defaults.length) {
    return defaults.slice(0, 3);
  }
  return defaults.slice(0, sessionsPerWeek);
}

export function AssignProgramModal({
  visible,
  onClose,
  program,
  clients,
  defaultClientId,
  clientLocked = false,
  defaultCustomize = false,
  loading,
  onConfirm,
}: AssignProgramModalProps) {
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssignFormData>({
    defaultValues: {
      clientId: defaultClientId || "",
      startDate: new Date(),
      trainingDays: defaultTrainingDays(program?.sessionsPerWeek),
      customize: defaultCustomize,
    },
  });

  const clientIdValue = watch("clientId");

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === clientIdValue),
    [clients, clientIdValue]
  );

  useEffect(() => {
    if (visible) {
      reset({
        clientId: defaultClientId || "",
        startDate: new Date(),
        trainingDays: defaultTrainingDays(program?.sessionsPerWeek),
        customize: defaultCustomize,
      });
    }
  }, [visible, program, defaultClientId, defaultCustomize, reset]);

  const trainingDays = watch("trainingDays");
  const startDate = watch("startDate");

  const toggleDay = (day: DayOfWeek) => {
    const exists = trainingDays.includes(day);
    const updated = exists
      ? trainingDays.filter((d) => d !== day)
      : [...trainingDays, day];
    const ordered = DAY_OPTIONS.map((opt) => opt.value).filter((dayValue) =>
      updated.includes(dayValue)
    );
    setValue("trainingDays", ordered, { shouldValidate: true });
  };

  const submit = (form: AssignFormData) => {
    if (!program) return;
    const payload: AssignProgramRequest = {
      programId: program.id,
      startDate: dayjs(form.startDate).startOf("day").toISOString(),
      trainingDays: form.trainingDays,
      customize: form.customize,
    };
    onConfirm({ clientId: form.clientId, data: payload });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-background">
        <View className="px-6 pt-16 pb-4 border-b border-border">
          <Text className="text-text-secondary text-xs uppercase tracking-[2px]">
            Program activ
          </Text>
          <Text className="text-text-primary text-2xl font-bold mt-1">
            {program?.name || "Selectează un program"}
          </Text>
          <Text className="text-text-muted text-sm mt-1">
            Setați data de start, zilele de antrenament și dacă vrei să personalizezi.
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {!clientLocked && (
            <Controller
              control={control}
              name="clientId"
              rules={{ required: "Selectează un client" }}
              render={({ field: { value }, fieldState: { error } }) => (
                <View className="mb-6">
                  <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                    CLIENT *
                  </Text>
                  <Pressable
                    onPress={() => setShowClientDropdown(!showClientDropdown)}
                    className={`bg-surface border rounded-2xl px-4 py-4 ${
                      error ? "border-red-500" : "border-border"
                    }`}
                  >
                    <Text
                      className={
                        selectedClient ? "text-text-primary" : "text-text-muted"
                      }
                    >
                      {selectedClient
                        ? `${selectedClient.firstName} ${selectedClient.lastName}`
                        : "Selectează client"}
                    </Text>
                  </Pressable>
                  {error && (
                    <Text className="text-xs text-red-400 mt-2">{error.message}</Text>
                  )}
                  {showClientDropdown && (
                    <View className="mt-2 bg-surface border border-border rounded-2xl overflow-hidden max-h-60">
                      <ScrollView>
                        {clients.map((client) => (
                          <Pressable
                            key={client.id}
                            onPress={() => {
                              setValue("clientId", client.id, { shouldValidate: true });
                              setShowClientDropdown(false);
                            }}
                            className="px-4 py-3 border-b border-border/50"
                          >
                            <Text className="text-text-primary">
                              {client.firstName} {client.lastName}
                            </Text>
                            {client.goalDescription ? (
                              <Text className="text-text-muted text-xs mt-1" numberOfLines={1}>
                                {client.goalDescription}
                              </Text>
                            ) : null}
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
          )}

          {clientLocked && selectedClient && (
            <View className="mb-6">
              <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-1">
                CLIENT
              </Text>
              <View className="bg-surface border border-border rounded-2xl px-4 py-3">
                <Text className="text-text-primary font-semibold">
                  {selectedClient.firstName} {selectedClient.lastName}
                </Text>
                {selectedClient.goalDescription ? (
                  <Text className="text-text-muted text-xs mt-1">
                    {selectedClient.goalDescription}
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          <Controller
            control={control}
            name="startDate"
            render={({ field: { value } }) => (
              <View className="mb-6">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  DATA DE START
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="bg-surface border border-border rounded-2xl px-4 py-4 flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-text-primary font-semibold">
                      {dayjs(value).format("DD MMM YYYY")}
                    </Text>
                    <Text className="text-text-muted text-xs mt-1">
                      Vom calcula săptămânile pe baza acestei date
                    </Text>
                  </View>
                  <Ionicons name="calendar-outline" size={18} color="#A3ADC8" />
                </Pressable>
              </View>
            )}
          />

          <Controller
            control={control}
            name="trainingDays"
            rules={{ validate: (val) => (val?.length ? true : "Alege cel puțin o zi") }}
            render={({ fieldState: { error } }) => (
              <View className="mb-6">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  ZILE DE ANTRENAMENT
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {DAY_OPTIONS.map((day) => {
                    const isActive = trainingDays.includes(day.value);
                    return (
                      <Pressable
                        key={day.value}
                        onPress={() => toggleDay(day.value)}
                        className={`px-3 py-2 rounded-full border ${
                          isActive
                            ? "border-primary/70 bg-primary/15"
                            : "border-border bg-background"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            isActive ? "text-primary" : "text-text-secondary"
                          }`}
                        >
                          {day.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {error && (
                  <Text className="text-xs text-red-400 mt-2">{error.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="customize"
            render={({ field: { value, onChange } }) => (
              <Pressable
                onPress={() => onChange(!value)}
                className="flex-row items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3"
              >
                <View
                  className={`w-6 h-6 rounded-lg border ${
                    value ? "bg-primary/90 border-primary" : "border-border"
                  } items-center justify-center`}
                >
                  {value ? <Ionicons name="checkmark" size={16} color="#0F111A" /> : null}
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">
                    Personalizează pentru acest client
                  </Text>
                  <Text className="text-text-muted text-xs mt-1">
                    Vom clona programul și vei putea modifica exercițiile.
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </ScrollView>

        <View className="px-6 pb-8 pt-2 border-t border-border bg-background">
          <Button
            label="Asignează program"
            onPress={handleSubmit(submit)}
            loading={loading}
            disabled={!program}
            fullWidth
          />
          <Button
            label="Anulează"
            variant="ghost"
            onPress={onClose}
            className="mt-3"
            fullWidth
          />
        </View>
      </View>

      <DateTimePicker
        visible={showDatePicker}
        value={startDate}
        onConfirm={(date) => {
          setValue("startDate", date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        title="Alege data de start"
      />
    </Modal>
  );
}
