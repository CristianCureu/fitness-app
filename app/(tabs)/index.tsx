import type { ComponentProps, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ro";
import { NextSessionCard } from "@/components/client-sessions";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { CongratsOverlay } from "@/components/ui/congrats-overlay";
import { useAppUser } from "@/lib/stores/auth-store";
import { useTodayView } from "@/lib/hooks/queries/use-today";
import { useUpdateSessionStatus } from "@/lib/hooks/queries/use-sessions";
import { useAskTodayAi } from "@/lib/hooks/queries/use-ai";
import { useDeleteCheckin, useUpsertCheckin } from "@/lib/hooks/queries/use-checkins";
import { useRouter } from "expo-router";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
}) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name={icon} size={16} color="#A3ADC8" />
        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ro");

export default function HomeScreen() {
  const appUser = useAppUser();
  const router = useRouter();
  const todayQuery = useTodayView();
  const updateSessionStatus = useUpdateSessionStatus();
  const askAi = useAskTodayAi();
  const upsertCheckin = useUpsertCheckin();
  const deleteCheckin = useDeleteCheckin();
  const [showAsk, setShowAsk] = useState(false);
  const [askQuestion, setAskQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState("");

  const nextSession = todayQuery.data?.nextSession || null;
  const clientTimezone =
    appUser?.clientProfile?.timezone || dayjs.tz.guess() || "UTC";
  const isSessionToday = nextSession
    ? dayjs(nextSession.startAt)
        .tz(clientTimezone)
        .isSame(dayjs().tz(clientTimezone), "day")
    : false;

  const nutritionTips = useMemo(() => {
    const tips: string[] = [];
    if (todayQuery.data?.nutritionSettings?.objective) {
      tips.push(todayQuery.data.nutritionSettings.objective);
    }
    if (todayQuery.data?.nutritionTip?.text) {
      tips.push(todayQuery.data.nutritionTip.text);
    }
    if (todayQuery.data?.nutritionSettings?.weeklyGoal1) {
      tips.push(todayQuery.data.nutritionSettings.weeklyGoal1);
    }
    return tips.slice(0, 2);
  }, [todayQuery.data]);

  const handleViewSessionDetails = () => {
    if (nextSession) {
      router.push(`/session/${nextSession.id}`);
    }
  };

  const handleCancelSession = () => {
    if (!nextSession) return;
    Alert.alert("Nu mai pot veni", "Confirmi anularea sesiunii?", [
      { text: "Renunta", style: "cancel" },
      {
        text: "Anuleaza",
        style: "destructive",
        onPress: () => {
          updateSessionStatus.mutate({ id: nextSession.id, status: "CANCELLED" });
        },
      },
    ]);
  };


  const handleAskAi = () => {
    if (!askQuestion.trim()) return;
    console.log("[AI][ask] sending", { questionLen: askQuestion.trim().length });
    const userText = askQuestion.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setAskQuestion("");
    askAi.mutate(askQuestion.trim(), {
      onSuccess: (data) => {
        console.log("[AI][ask] success", { ideas: data.ideas?.length || 0 });
        const responseLines = (data.ideas || []).map((idea) => `• ${idea}`);
        if (data.answer) {
          responseLines.unshift(data.answer);
        }
        const assistantText =
          responseLines.length > 0
            ? responseLines.join("\n")
            : "Am nevoie de putin mai mult context.";
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: assistantText },
        ]);
        setAskQuestion("");
      },
      onError: (error) => {
        console.log("[AI][ask] error", {
          message: error instanceof Error ? error.message : String(error),
        });
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Nu am putut raspunde acum. Incearca din nou." },
        ]);
      },
    });
  };

  const handleAskPreset = (preset: string) => {
    const text = preset.trim();
    if (!text) return;
    console.log("[AI][ask] sending", { questionLen: text.length });
    setChatMessages((prev) => [...prev, { role: "user", text }]);
    askAi.mutate(text, {
      onSuccess: (data) => {
        console.log("[AI][ask] success", { ideas: data.ideas?.length || 0 });
        const responseLines = (data.ideas || []).map((idea) => `• ${idea}`);
        if (data.answer) {
          responseLines.unshift(data.answer);
        }
        const assistantText =
          responseLines.length > 0
            ? responseLines.join("\n")
            : "Am nevoie de putin mai mult context.";
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: assistantText },
        ]);
      },
      onError: (error) => {
        console.log("[AI][ask] error", {
          message: error instanceof Error ? error.message : String(error),
        });
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Nu am putut raspunde acum. Incearca din nou." },
        ]);
      },
    });
  };

  const hasWorkoutToday = isSessionToday;
  const checkin = todayQuery.data?.checkin;

  const focusText = hasWorkoutToday
    ? `Sesiune azi: ${nextSession?.sessionName || "Program"}.`
    : "Zi de recuperare - focus pe somn si hidratare.";

  const tipsText = hasWorkoutToday
    ? "Inainte: carbohidrati usori + apa. Dupa: proteina + legume."
    : "Mentine mesele regulate si o plimbare usoara.";

  const triggerCongrats = (message: string) => {
    setCongratsMessage(message);
    setShowCongrats(true);
  };

  const handleToggleCheckin = () => {
    if (!hasWorkoutToday) return;
    if (checkin?.id) {
      deleteCheckin.mutate(checkin.id);
      return;
    }
    upsertCheckin.mutate(
      {},
      {
        onSuccess: () => {
          triggerCongrats("Check-in completat. Bravo!");
        },
      }
    );
  };

  console.log(nextSession)
  console.log(isSessionToday)

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-secondary text-sm mb-2">
          Azi • {dayjs().tz(clientTimezone).format("D MMMM YYYY")}
        </Text>
        <Text className="text-text-primary text-3xl font-bold">
          Salut, {appUser?.clientProfile?.firstName || "User"}
        </Text>
      </View>

      <View className="px-6 pb-6">
        <SectionCard title="Sesiunea de azi" icon="barbell-outline">
          {todayQuery.isLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="small" color="#f798af" />
              <Text className="text-text-muted text-sm mt-2">Se încarcă sesiunea...</Text>
            </View>
          ) : nextSession && isSessionToday ? (
            <NextSessionCard
              session={nextSession}
              onViewDetails={handleViewSessionDetails}
              onCancel={handleCancelSession}
              cancelDisabled={updateSessionStatus.isPending}
              loading={todayQuery.isLoading}
              clientTimezone={clientTimezone}
            />
          ) : (
            <View className="bg-background border border-border rounded-2xl p-4">
              <Text className="text-text-primary font-semibold">
                Nu ai sesiune programata azi
              </Text>
              <Text className="text-text-muted text-sm mt-1">
                Poti programa o sesiune din tabul Program.
              </Text>
            </View>
          )}
        </SectionCard>

        {hasWorkoutToday ? (
          <SectionCard title="Check-in rapid" icon="checkmark-circle-outline">
            {checkin ? (
              <Pressable
                onPress={handleToggleCheckin}
                className="self-start rounded-full bg-primary/15 border border-primary/40 px-4 py-2"
              >
                <Text className="text-primary text-sm font-semibold">Check-in făcut</Text>
              </Pressable>
            ) : (
              <Button
                label="Check-in"
                variant="outline"
                iconName="checkmark-circle-outline"
                onPress={handleToggleCheckin}
              />
            )}
          </SectionCard>
        ) : null}

        <SectionCard title="Tips nutritie" icon="leaf-outline">
          {todayQuery.isLoading ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#f798af" />
              <Text className="text-text-muted text-sm mt-2">Se încarcă tips-urile...</Text>
            </View>
          ) : nutritionTips.length ? (
            nutritionTips.map((tip, idx) => (
              <View key={`${tip}-${idx}`} className="flex-row items-start gap-2 mb-2">
                <Ionicons name="checkmark-circle-outline" size={16} color="#7be495" />
                <Text className="text-text-primary text-sm flex-1">{tip}</Text>
              </View>
            ))
          ) : (
            <Text className="text-text-muted text-sm">Nu sunt tips-uri pentru azi.</Text>
          )}
        </SectionCard>

        <SectionCard title="Focusul zilei" icon="star-outline">
          <Text className="text-text-primary text-base">{focusText}</Text>
          {tipsText ? (
            <Text className="text-text-muted text-sm mt-2">{tipsText}</Text>
          ) : null}
        </SectionCard>

        <SectionCard title="Pre/Post workout nutritie" icon="nutrition-outline">
          {hasWorkoutToday ? (
            <View className="gap-3">
              <View className="bg-background border border-border rounded-xl p-3">
                <Text className="text-text-secondary text-xs uppercase tracking-wider">
                  Inainte
                </Text>
                <Text className="text-text-primary text-sm mt-1">
                  Alege carbohidrati usori + apa cu 60-90 min inainte de antrenament.
                </Text>
              </View>
              <View className="bg-background border border-border rounded-xl p-3">
                <Text className="text-text-secondary text-xs uppercase tracking-wider">
                  Dupa
                </Text>
                <Text className="text-text-primary text-sm mt-1">
                  Include proteina la masa de dupa si adauga o portie de legume.
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-text-muted text-sm">
              Nu ai antrenament azi, focus pe hidratare si mese regulate.
            </Text>
          )}
        </SectionCard>

        <SectionCard title="AI rapid" icon="chatbubble-ellipses-outline">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-text-primary font-semibold">Intreaba-l pe Cristian</Text>
              <Text className="text-text-muted text-sm mt-1">
                Raspunsuri scurte, maximum 3 idei.
              </Text>
            </View>
            <Button
              label="Chat"
              variant="outline"
              iconName="chatbubble-ellipses-outline"
              onPress={() => setShowAsk(true)}
            />
          </View>
          <View className="mt-3 gap-2">
            <Text className="text-text-muted text-xs">Exemple:</Text>
            <Text className="text-text-secondary text-sm">
              • Ce sa mananc azi la pranz daca sunt la birou?
            </Text>
            <Text className="text-text-secondary text-sm">
              • Am mancat pizza aseara, ce fac azi?
            </Text>
            <Text className="text-text-secondary text-sm">
              • Ce snack rapid pot lua inainte de sala?
            </Text>
          </View>
        </SectionCard>
      </View>
      <Modal visible={showAsk} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl px-6 pt-5 pb-8">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <View className="w-9 h-9 rounded-full bg-primary/20 items-center justify-center">
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color="#f798af" />
                </View>
                <View>
                  <Text className="text-text-primary text-lg font-semibold">Cristian</Text>
                  <Text className="text-text-muted text-xs">Coach AI</Text>
                </View>
              </View>
              <Button
                label="Inchide"
                variant="ghost"
                onPress={() => setShowAsk(false)}
                iconName="close-outline"
              />
            </View>

            <ScrollView className="max-h-80 mb-4">
              {chatMessages.length === 0 ? (
                <View className="bg-surface border border-border rounded-2xl p-4">
                  <Text className="text-text-muted text-sm">
                    Pune o intrebare scurta despre nutritie. Raspund cu maxim 3 idei.
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mt-3">
                    {[
                      "Ce sa mananc azi la pranz daca sunt la birou?",
                      "Am mancat pizza aseara, ce fac azi ca sa compensez?",
                      "Ce snack rapid pot lua inainte de sala?",
                    ].map((preset) => (
                      <View key={preset} className="rounded-full bg-background border border-border px-3 py-2">
                        <Text
                          className="text-text-secondary text-xs"
                          onPress={() => handleAskPreset(preset)}
                        >
                          {preset}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View className="gap-3">
                  {chatMessages.map((message, idx) => {
                    const isUser = message.role === "user";
                    return (
                      <View
                        key={`${message.role}-${idx}`}
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          isUser
                            ? "bg-primary/20 border border-primary/40 self-end"
                            : "bg-surface border border-border"
                        }`}
                      >
                        <Text
                          className={`text-sm ${
                            isUser ? "text-text-primary" : "text-text-secondary"
                          }`}
                        >
                          {message.text}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            <FormInput
              label="Scrie un mesaj"
              value={askQuestion}
              onChangeText={setAskQuestion}
              placeholder="Ex: Ce pot manca azi la pranz?"
              multiline
              className="min-h-[72px] text-sm"
            />
            <Button
              label="Trimite"
              onPress={handleAskAi}
              loading={askAi.isPending}
              disabled={askAi.isPending}
              iconName="send-outline"
              className="mt-3"
            />
          </View>
        </View>
      </Modal>

      <CongratsOverlay
        visible={showCongrats}
        message={congratsMessage}
        onDone={() => setShowCongrats(false)}
      />
    </ScrollView>
  );
}
