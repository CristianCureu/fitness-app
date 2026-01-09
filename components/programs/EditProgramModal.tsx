import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import type { DayOfWeek, Program, UpdateProgramRequest, Exercise, SessionExercise } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { ExerciseSearchDropdown } from "./ExerciseSearchDropdown";

const DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "Lu" },
  { value: "TUESDAY", label: "Ma" },
  { value: "WEDNESDAY", label: "Mi" },
  { value: "THURSDAY", label: "Jo" },
  { value: "FRIDAY", label: "Vi" },
  { value: "SATURDAY", label: "Sa" },
  { value: "SUNDAY", label: "Du" },
];

interface ProgramFormData {
  name: string;
  description: string;
  sessions: Array<{
    dayNumber: number;
    name: string;
    focus: string;
    notes: string;
    exercises: Array<{
      id?: string;
      exerciseId: string;
      orderIndex: number;
      sets?: number;
      reps?: string;
      notes?: string;
      exercise?: Exercise;
    }>;
  }>;
}

interface EditProgramModalProps {
  visible: boolean;
  onClose: () => void;
  program?: Program;
  trainingDays?: DayOfWeek[];
  onSave: (data: UpdateProgramRequest, trainingDays?: DayOfWeek[]) => void;
  loading?: boolean;
  showTrainingDays?: boolean;
}

export function EditProgramModal({
  visible,
  onClose,
  program,
  trainingDays: initialTrainingDays,
  onSave,
  loading,
  showTrainingDays = false,
}: EditProgramModalProps) {
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    initialTrainingDays || []
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramFormData>({
    defaultValues: {
      name: program?.name || "",
      description: program?.description || "",
      sessions: program?.sessions.map((s) => ({
        dayNumber: s.dayNumber,
        name: s.name,
        focus: s.focus,
        notes: s.notes || "",
        exercises: s.exercises?.map((ex, idx) => ({
          id: ex.id,
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex ?? idx,
          sets: ex.sets,
          reps: ex.reps,
          notes: ex.notes,
          exercise: ex.exercise,
        })) || [],
      })) || [],
    },
  });

  useEffect(() => {
    if (visible && program) {
      reset({
        name: program.name,
        description: program.description || "",
        sessions: program.sessions.map((s) => ({
          dayNumber: s.dayNumber,
          name: s.name,
          focus: s.focus,
          notes: s.notes || "",
          exercises: s.exercises?.map((ex, idx) => ({
            id: ex.id,
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex ?? idx,
            sets: ex.sets,
            reps: ex.reps,
            notes: ex.notes,
            exercise: ex.exercise,
          })) || [],
        })),
      });
      setSelectedDays(initialTrainingDays || []);
    }
  }, [visible, program, initialTrainingDays, reset]);

  const toggleDay = (day: DayOfWeek) => {
    const exists = selectedDays.includes(day);
    const updated = exists
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    const ordered = DAY_OPTIONS.map((opt) => opt.value).filter((dayValue) =>
      updated.includes(dayValue)
    );
    setSelectedDays(ordered);
  };

  const addExercise = (sessionIndex: number) => {
    const currentExercises = watch(`sessions.${sessionIndex}.exercises`) || [];
    setValue(`sessions.${sessionIndex}.exercises`, [
      ...currentExercises,
      {
        exerciseId: "",
        orderIndex: currentExercises.length,
        sets: undefined,
        reps: undefined,
        notes: undefined,
      },
    ]);
  };

  const removeExercise = (sessionIndex: number, exerciseIndex: number) => {
    const currentExercises = watch(`sessions.${sessionIndex}.exercises`) || [];
    const updated = currentExercises.filter((_, idx) => idx !== exerciseIndex);
    // Re-index remaining exercises
    const reindexed = updated.map((ex, idx) => ({ ...ex, orderIndex: idx }));
    setValue(`sessions.${sessionIndex}.exercises`, reindexed);
  };

  const onSubmit = (formData: ProgramFormData) => {
    const data: UpdateProgramRequest = {
      name: formData.name,
      description: formData.description || undefined,
      sessions: formData.sessions.map((s) => ({
        dayNumber: s.dayNumber,
        name: s.name,
        focus: s.focus,
        notes: s.notes || undefined,
        exercises: s.exercises
          ?.filter((ex) => ex.exerciseId) // Only include exercises with selected exercise
          .map((ex) => ({
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex,
            sets: ex.sets,
            reps: ex.reps || undefined,
            notes: ex.notes || undefined,
          })),
      })),
    };
    onSave(data, showTrainingDays ? selectedDays : undefined);
  };

  if (!program) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background rounded-t-3xl" style={{ maxHeight: "90%" }}>
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <Text className="text-text-primary text-xl font-bold">
              Editează program
            </Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#A3ADC8" />
            </Pressable>
          </View>

          <ScrollView className="px-6 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Program Info */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
                Informații program
              </Text>

              <Controller
                control={control}
                name="name"
                rules={{ required: "Numele programului este obligatoriu" }}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="NUME PROGRAM"
                    value={value}
                    onChangeText={onChange}
                    placeholder="ex: Upper Lower Split"
                    error={errors.name?.message}
                    containerClassName="mb-3"
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="DESCRIERE"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Descriere program..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    style={{ minHeight: 80 }}
                    containerClassName="mb-3"
                  />
                )}
              />
            </View>

            {/* Training Days */}
            {showTrainingDays && (
              <View className="mb-4">
                <Text className="text-xs font-semibold text-text-muted tracking-[1px] mb-2">
                  ZILE DE ANTRENAMENT
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {DAY_OPTIONS.map((day) => {
                    const isActive = selectedDays.includes(day.value);
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
                {selectedDays.length === 0 && (
                  <Text className="text-xs text-red-400 mt-2">
                    Alege cel puțin o zi
                  </Text>
                )}
              </View>
            )}

            {/* Sessions */}
            <View className="mb-6">
              <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
                Sesiuni de antrenament
              </Text>

              {program.sessions.map((session, index) => (
                <View
                  key={session.dayNumber}
                  className="bg-surface border border-border rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 items-center justify-center">
                      <Text className="text-primary text-sm font-semibold">
                        Z{session.dayNumber}
                      </Text>
                    </View>
                    <Text className="text-text-primary font-semibold">
                      Ziua {session.dayNumber}
                    </Text>
                  </View>

                  <Controller
                    control={control}
                    name={`sessions.${index}.name`}
                    rules={{ required: "Numele sesiunii este obligatoriu" }}
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label="NUME SESIUNE"
                        value={value}
                        onChangeText={onChange}
                        placeholder="ex: Upper Body"
                        error={errors.sessions?.[index]?.name?.message}
                        containerClassName="mb-2"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`sessions.${index}.focus`}
                    rules={{ required: "Focus-ul este obligatoriu" }}
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label="FOCUS"
                        value={value}
                        onChangeText={onChange}
                        placeholder="ex: Chest, Shoulders, Triceps"
                        error={errors.sessions?.[index]?.focus?.message}
                        containerClassName="mb-2"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`sessions.${index}.notes`}
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label="NOTE (OPȚIONAL)"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Note despre sesiune..."
                        multiline
                        numberOfLines={2}
                        textAlignVertical="top"
                        style={{ minHeight: 60 }}
                        containerClassName="mb-3"
                      />
                    )}
                  />

                  {/* Exercises Section - Only for custom programs */}
                  {!program.isDefault && (
                    <View>
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-xs font-semibold text-text-muted tracking-[1px]">
                          EXERCIȚII
                        </Text>
                        <Pressable
                          onPress={() => addExercise(index)}
                          className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 border border-primary/30"
                        >
                          <Ionicons name="add" size={16} color="#f798af" />
                          <Text className="text-primary text-xs font-semibold">
                            Adaugă
                          </Text>
                        </Pressable>
                      </View>

                      {watch(`sessions.${index}.exercises`)?.map((_, exIndex) => (
                        <View
                          key={exIndex}
                          className="bg-background rounded-xl p-3 mb-2 border border-border"
                        >
                          <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-text-secondary text-xs font-semibold">
                              Exercițiu {exIndex + 1}
                            </Text>
                            <Pressable
                              onPress={() => removeExercise(index, exIndex)}
                              className="p-1"
                            >
                              <Ionicons name="close-circle" size={20} color="#EF4444" />
                            </Pressable>
                          </View>

                          <Controller
                            control={control}
                            name={`sessions.${index}.exercises.${exIndex}.exercise`}
                            rules={{ required: "Selectează un exercițiu" }}
                            render={({ field: { onChange, value } }) => (
                              <ExerciseSearchDropdown
                                value={value}
                                onChange={(exercise) => {
                                  onChange(exercise);
                                  setValue(`sessions.${index}.exercises.${exIndex}.exerciseId`, exercise.id);
                                }}
                                placeholder="Caută exercițiu..."
                                error={errors.sessions?.[index]?.exercises?.[exIndex]?.exercise?.message}
                              />
                            )}
                          />

                          <View className="flex-row gap-2 mt-2">
                            <Controller
                              control={control}
                              name={`sessions.${index}.exercises.${exIndex}.sets`}
                              render={({ field: { onChange, value } }) => (
                                <FormInput
                                  label="SETURI"
                                  value={value?.toString() || ""}
                                  onChangeText={(text) => onChange(text ? parseInt(text) : undefined)}
                                  placeholder="3"
                                  keyboardType="number-pad"
                                  containerClassName="flex-1"
                                />
                              )}
                            />

                            <Controller
                              control={control}
                              name={`sessions.${index}.exercises.${exIndex}.reps`}
                              render={({ field: { onChange, value } }) => (
                                <FormInput
                                  label="REPETĂRI"
                                  value={value || ""}
                                  onChangeText={onChange}
                                  placeholder="8-12"
                                  containerClassName="flex-1"
                                />
                              )}
                            />
                          </View>

                          <Controller
                            control={control}
                            name={`sessions.${index}.exercises.${exIndex}.notes`}
                            render={({ field: { onChange, value } }) => (
                              <FormInput
                                label="NOTE (OPȚIONAL)"
                                value={value || ""}
                                onChangeText={onChange}
                                placeholder="Note despre exercițiu..."
                                multiline
                                numberOfLines={2}
                                textAlignVertical="top"
                                style={{ minHeight: 50 }}
                                containerClassName="mt-2"
                              />
                            )}
                          />
                        </View>
                      ))}

                      {(!watch(`sessions.${index}.exercises`) || watch(`sessions.${index}.exercises`)?.length === 0) && (
                        <View className="py-4 items-center">
                          <Text className="text-text-muted text-xs">
                            Nu există exerciții adăugate
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="px-6 py-4 border-t border-border">
            <View className="flex-row gap-3">
              <Button
                label="Salvează"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                iconName="save-outline"
                className="flex-1"
              />
              <Button
                label="Anulează"
                variant="ghost"
                onPress={onClose}
                iconName="close-outline"
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
