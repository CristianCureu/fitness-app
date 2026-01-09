import { Button } from "@/components/ui/button";
import type {
  ClientProgram,
  ClientStats,
  ProgramRecommendation,
} from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Text, View } from "react-native";
import { Section } from "./Section";

interface RecommendationsSectionProps {
  recommendations?: ProgramRecommendation[];
  clientStats?: ClientStats;
  currentProgram?: ClientProgram | null;
  loading?: boolean;
  onAssign: (payload: { programId: string; programName: string; customize?: boolean }) => void;
}

const CONFIDENCE_STYLES: Record<
  NonNullable<ProgramRecommendation["confidence"]>,
  { label: string; color: string; bg: string }
> = {
  HIGH: { label: "Ridicată", color: "#7be495", bg: "#1f3d2b" },
  MEDIUM: { label: "Medie", color: "#f4b86b", bg: "#382b1f" },
  LOW: { label: "Scăzută", color: "#f87171", bg: "#3a2a2a" },
};

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-background border border-border rounded-xl px-3 py-2">
      <Text className="text-text-secondary text-[11px] uppercase tracking-widest">
        {label}
      </Text>
      <Text className="text-text-primary font-semibold mt-1">{value}</Text>
    </View>
  );
}

export function RecommendationsSection({
  recommendations,
  clientStats,
  currentProgram,
  loading,
  onAssign,
}: RecommendationsSectionProps) {
  return (
    <Section title="Recomandări AI" icon="bulb-outline">
      {currentProgram ? (
        <View className="mb-3">
          <Text className="text-text-secondary text-xs">
            Program curent: <Text className="text-text-primary">{currentProgram.program.name}</Text>
          </Text>
        </View>
      ) : null}

      {clientStats && (
        <View className="flex-row flex-wrap gap-2 mb-4">
          <StatChip label="Rată finalizare" value={`${Math.round(clientStats.completionRate)}%`} />
          <StatChip label="Consistență" value={`${clientStats.consistency.toFixed(1)}/săpt`} />
          <StatChip label="Nutriție" value={`${clientStats.avgNutritionScore.toFixed(1)}/10`} />
          <StatChip label="Durere" value={`${Math.round(clientStats.painFrequency)}%`} />
        </View>
      )}

      {loading ? (
        <View className="py-6 items-center">
          <ActivityIndicator color="#f798af" />
          <Text className="text-text-muted text-sm mt-2">Calculăm sugestiile...</Text>
        </View>
      ) : recommendations && recommendations.length ? (
        recommendations.map((rec) => {
          const confidence = CONFIDENCE_STYLES[rec.confidence];
          return (
            <View
              key={rec.programId}
              className="bg-surface border border-border rounded-2xl p-4 mb-3"
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    {rec.programName}
                  </Text>
                  <Text className="text-text-muted text-sm mt-1">
                    Scor: {rec.score.toFixed(1)} / 10
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: confidence.bg }}
                >
                  <Text className="text-[11px] font-semibold" style={{ color: confidence.color }}>
                    Încredere {confidence.label}
                  </Text>
                </View>
              </View>

              {rec.reasons?.length ? (
                <View className="mt-3">
                  <Text className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    De ce recomandăm
                  </Text>
                  {rec.reasons.slice(0, 3).map((reason, idx) => (
                    <View key={idx} className="flex-row items-start gap-2">
                      <Ionicons name="checkmark-circle" size={14} color="#7be495" />
                      <Text className="text-text-primary text-sm flex-1">{reason}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {rec.warnings?.length ? (
                <View className="mt-2">
                  <Text className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    Atenții
                  </Text>
                  {rec.warnings.slice(0, 2).map((warning, idx) => (
                    <View key={idx} className="flex-row items-start gap-2">
                      <Ionicons name="alert-circle" size={14} color="#f4b86b" />
                      <Text className="text-text-primary text-sm flex-1">{warning}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <View className="flex-row gap-3 mt-4">
                <Button
                  label="Asignează"
                  onPress={() =>
                    onAssign({ programId: rec.programId, programName: rec.programName })
                  }
                  iconName="checkmark-circle-outline"
                  className="flex-1"
                />
                <Button
                  label="Personalizează"
                  variant="outline"
                  onPress={() =>
                    onAssign({
                      programId: rec.programId,
                      programName: rec.programName,
                      customize: true,
                    })
                  }
                  iconName="create-outline"
                  className="flex-1"
                />
              </View>
            </View>
          );
        })
      ) : (
        <View className="bg-background border border-border rounded-2xl p-4">
          <Text className="text-text-primary font-semibold">Nicio recomandare momentan</Text>
          <Text className="text-text-muted text-sm mt-1">
            Completează datele clientului sau reîncarcă pentru a obține sugestii.
          </Text>
        </View>
      )}
    </Section>
  );
}
