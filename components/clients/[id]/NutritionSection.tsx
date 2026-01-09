import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Section } from "./Section";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";
import type { ClientProfile } from "@/lib/types/api";
import { useNutritionSettings, useUpsertNutritionSettings } from "@/lib/hooks/queries/use-nutrition";

interface NutritionSectionProps {
  client: ClientProfile;
}

export function NutritionSection({ client }: NutritionSectionProps) {
  const settingsQuery = useNutritionSettings({ clientId: client.id });
  const upsertSettings = useUpsertNutritionSettings();

  const [objective, setObjective] = useState("");
  const [proteinTarget, setProteinTarget] = useState(0);
  const [waterTarget, setWaterTarget] = useState(0);
  const [weeklyGoal1, setWeeklyGoal1] = useState("");

  useEffect(() => {
    if (!settingsQuery.data) return;
    setObjective(settingsQuery.data.objective || "");
    setProteinTarget(settingsQuery.data.proteinTargetPerDay);
    setWaterTarget(settingsQuery.data.waterTargetMlPerDay);
    setWeeklyGoal1(settingsQuery.data.weeklyGoal1 || "");
  }, [settingsQuery.data]);

  const handleSave = () => {
    upsertSettings.mutate({
      clientId: client.id,
      objective: objective || undefined,
      proteinTargetPerDay: proteinTarget,
      waterTargetMlPerDay: waterTarget,
      weeklyGoal1: weeklyGoal1 || undefined,
    });
  };

  return (
    <Section title="Nutriție" icon="leaf-outline">
      {settingsQuery.isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator color="#f798af" />
        </View>
      ) : (
        <View className="gap-3">
          <FormInput
            label="Tip nutritie"
            value={objective}
            onChangeText={setObjective}
            placeholder="Ex: 1 portie legume la pranz"
          />
          <FormInput
            label="Tinta proteine / zi (g)"
            value={String(proteinTarget)}
            keyboardType="numeric"
            onChangeText={(text) => setProteinTarget(Number(text) || 0)}
          />
          <FormInput
            label="Tinta apa / zi (ml)"
            value={String(waterTarget)}
            keyboardType="numeric"
            onChangeText={(text) => setWaterTarget(Number(text) || 0)}
          />
          <FormInput
            label="Obiectiv saptamanal 1"
            value={weeklyGoal1}
            onChangeText={setWeeklyGoal1}
            placeholder="Ex: 2 portii legume/zi"
          />
          <Button
            label="Salveaza setarile"
            onPress={handleSave}
            loading={upsertSettings.isPending}
            disabled={upsertSettings.isPending}
            iconName="save-outline"
          />
        </View>
      )}
    </Section>
  );
}
