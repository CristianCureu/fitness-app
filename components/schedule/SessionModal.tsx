import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import type { ClientProfile, CreateSessionDto, ScheduledSession } from "@/lib/types/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import FormInput from "../ui/form-input";

dayjs.extend(utc);
dayjs.extend(timezone);

const SESSION_TYPES = [
  "Antrenament Personal",
  "Antrenament Functional",
  "Cardio",
  "Forță",
  "Mobilitate",
  "Evaluare Inițială",
];

interface SessionFormData {
  clientId: string;
  sessionType: string;
  sessionName: string;
  startAt: Date;
  endAt: Date;
}

interface SessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateSessionDto) => void;
  clients: ClientProfile[];
  session?: ScheduledSession;
  loading?: boolean;
}

export function SessionModal({
  visible,
  onClose,
  onSave,
  clients,
  session,
  loading,
}: SessionModalProps) {
  const isEdit = !!session;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SessionFormData>({
    defaultValues: {
      clientId: session?.clientId || "",
      sessionType: session?.sessionType || SESSION_TYPES[0],
      sessionName: session?.sessionName || "",
      startAt: session ? new Date(session.startAt) : new Date(),
      endAt: session ? new Date(session.endAt) : dayjs().add(1, "hour").toDate(),
    },
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const startAt = watch("startAt");
  const endAt = watch("endAt");
  const clientId = watch("clientId");
  const sessionType = watch("sessionType");
  const sessionName = watch("sessionName");

  const selectedClient = clients.find((c) => c.id === clientId);
  const clientTimezone =
    selectedClient?.timezone || dayjs.tz.guess() || "UTC";

  // Reset form when modal opens/closes or session changes
  useEffect(() => {
    if (visible) {
      const timezoneName =
        clients.find((c) => c.id === (session?.clientId || clientId))?.timezone ||
        dayjs.tz.guess() ||
        "UTC";
      reset({
        clientId: session?.clientId || "",
        sessionType: session?.sessionType || SESSION_TYPES[0],
        sessionName: session?.sessionName || "",
        startAt: session
          ? dayjs(session.startAt).tz(timezoneName).toDate()
          : new Date(),
        endAt: session
          ? dayjs(session.endAt).tz(timezoneName).toDate()
          : dayjs().add(1, "hour").toDate(),
      });
    }
  }, [visible, session, reset, clients, clientId]);

  const onSubmit = (formData: SessionFormData) => {
    const startAt = dayjs
      .tz(dayjs(formData.startAt).format("YYYY-MM-DD HH:mm"), clientTimezone)
      .toISOString();
    const endAt = dayjs
      .tz(dayjs(formData.endAt).format("YYYY-MM-DD HH:mm"), clientTimezone)
      .toISOString();
    const data: CreateSessionDto = {
      clientId: formData.clientId,
      sessionType: formData.sessionType,
      sessionName: formData.sessionName,
      startAt,
      endAt,
    };

    onSave(data);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-background">
        <View className="px-6 pt-16 pb-4 border-b border-border">
          <Text className="text-text-primary text-2xl font-bold">
            {isEdit ? "Editează sesiune" : "Adaugă sesiune"}
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Client Selection */}

          {!isEdit && (
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
                      className={selectedClient ? "text-text-primary" : "text-text-muted"}
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
                              setValue("clientId", client.id);
                              setShowClientDropdown(false);
                            }}
                            className="px-4 py-3 border-b border-border/50"
                          >
                            <Text className="text-text-primary">
                              {client.firstName} {client.lastName}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
          )}

          {/* Session Type */}
          <Controller
            control={control}
            name="sessionType"
            rules={{ required: "Selectează tipul sesiunii" }}
            render={({ field: { value }, fieldState: { error } }) => (
              <View className="mb-6">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  TIP SESIUNE *
                </Text>
                <Pressable
                  onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                  className={`bg-surface border rounded-2xl px-4 py-4 ${
                    error ? "border-red-500" : "border-border"
                  }`}
                >
                  <Text className="text-text-primary">{sessionType}</Text>
                </Pressable>
                {error && (
                  <Text className="text-xs text-red-400 mt-2">{error.message}</Text>
                )}
                {showTypeDropdown && (
                  <View className="mt-2 bg-surface border border-border rounded-2xl overflow-hidden">
                    {SESSION_TYPES.map((type) => (
                      <Pressable
                        key={type}
                        onPress={() => {
                          setValue("sessionType", type);
                          setShowTypeDropdown(false);
                        }}
                        className="px-4 py-3 border-b border-border/50"
                      >
                        <Text className="text-text-primary">{type}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}
          />

          {/* Session Name */}
          <Controller
            control={control}
            name="sessionName"
            rules={{ required: "Numele sesiunii este obligatoriu" }}
            render={({ field: { value }, fieldState: { error } }) => (
              <View className="mb-6">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  NUME SESIUNE *
                </Text>
                <FormInput
                  value={sessionName}
                  onChangeText={(text) => setValue("sessionName", text)}
                  placeholder="Ex: Antrenament Piept + Triceps"
                  error={error?.message}
                  className="bg-surface"
                />
              </View>
            )}
          />

          {/* Start Date/Time */}
          <Controller
            control={control}
            name="startAt"
            rules={{
              required: "Selectează data și ora de început",
              validate: (value) => {
                if (value >= endAt) {
                  return "Ora de început trebuie să fie înainte de ora de sfârșit";
                }
                return true;
              },
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <View className="mb-6">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  DATA ȘI ORA ÎNCEPUT *
                </Text>
                <Pressable
                  onPress={() => setShowStartPicker(true)}
                  className={`bg-surface border rounded-2xl px-4 py-4 ${
                    error ? "border-red-500" : "border-border"
                  }`}
                >
                  <Text className="text-text-primary">
                    {dayjs(startAt).format("DD.MM.YYYY HH:mm")}
                  </Text>
                </Pressable>
                {error && (
                  <Text className="text-xs text-red-400 mt-2">{error.message}</Text>
                )}
                <DateTimePicker
                  visible={showStartPicker}
                  value={startAt}
                  onConfirm={(date) => {
                    setShowStartPicker(false);
                    setValue("startAt", date);
                  }}
                  onCancel={() => {
                    setShowStartPicker(false);
                  }}
                  title="Selectează data și ora de început"
                />
              </View>
            )}
          />

          {/* End Date/Time */}
          <Controller
            control={control}
            name="endAt"
            rules={{
              required: "Selectează data și ora de sfârșit",
              validate: (value) => {
                if (value <= startAt) {
                  return "Ora de sfârșit trebuie să fie după ora de început";
                }
                return true;
              },
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <View className="mb-6">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  DATA ȘI ORA SFÂRȘIT *
                </Text>
                <Pressable
                  onPress={() => setShowEndPicker(true)}
                  className={`bg-surface border rounded-2xl px-4 py-4 ${
                    error ? "border-red-500" : "border-border"
                  }`}
                >
                  <Text className="text-text-primary">
                    {dayjs(endAt).format("DD.MM.YYYY HH:mm")}
                  </Text>
                </Pressable>
                {error && (
                  <Text className="text-xs text-red-400 mt-2">{error.message}</Text>
                )}
                <DateTimePicker
                  visible={showEndPicker}
                  value={endAt}
                  onConfirm={(date) => {
                    setShowEndPicker(false);
                    setValue("endAt", date);
                  }}
                  onCancel={() => {
                    setShowEndPicker(false);
                  }}
                  title="Selectează data și ora de sfârșit"
                />
              </View>
            )}
          />
        </ScrollView>

        {/* Actions */}
        <View className="px-6 py-4 border-t border-border flex-row gap-3">
          <Button
            label="Anulează"
            variant="ghost"
            onPress={onClose}
            iconName="close-outline"
            className="flex-1"
          />
          <Button
            label={isEdit ? "Salvează" : "Adaugă"}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            iconName={isEdit ? "save-outline" : "add-circle-outline"}
            className="flex-1"
          />
        </View>
      </View>
    </Modal>
  );
}
