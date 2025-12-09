import type { Program } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "../ui/button";

type ProgramCardProps = {
  program: Program;
  onAssign?: (program: Program) => void;
};

const DAY_BADGES = ["A", "B", "C", "D", "E", "F", "G"];

export function ProgramCard({ program, onAssign }: ProgramCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const badgeLabel = program.isDefault ? "template" : "Personalizat";
  const sessions = [...program.sessions].sort((a, b) => a.dayNumber - b.dayNumber);

  console.log(program);
  return (
    <View className="bg-surface border border-border rounded-2xl p-4 mb-3">
      <Pressable
        className="flex-row justify-between items-start gap-3"
        onPress={() => setIsOpen(!isOpen)}
      >
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2 mb-1">
            <Text
              className="text-text-primary text-lg font-semibold max-w-64"
              numberOfLines={2}
            >
              {program.name}
            </Text>
            <View
              className={`px-2 py-1 rounded-full border self-start ${
                program.isDefault
                  ? "border-primary/50 bg-primary/15"
                  : "border-border bg-background"
              }`}
            >
              <Text
                className={`text-[10px] font-semibold uppercase tracking-widest ${
                  program.isDefault ? "text-primary" : "text-text-secondary"
                }`}
              >
                {badgeLabel}
              </Text>
            </View>
          </View>

          <Text className="text-text-muted text-sm" numberOfLines={2}>
            {program.description || "Fără descriere adăugată încă."}
          </Text>

          <View className="flex-row items-center gap-3 mt-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="repeat-outline" size={16} color="#A3ADC8" />
              <Text className="text-text-secondary text-xs font-semibold">
                {program.sessionsPerWeek}x/săpt
              </Text>
            </View>
            {typeof program.durationWeeks === "number" && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="calendar-outline" size={16} color="#A3ADC8" />
                <Text className="text-text-secondary text-xs font-semibold">
                  {program.durationWeeks} săpt
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>

      {isOpen && (
        <View className="mt-3 border-t border-border/60 pt-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-secondary text-xs uppercase tracking-wider">
              Structură
            </Text>
            <Text className="text-text-muted text-xs">
              {program.sessionsPerWeek} zile / săpt
            </Text>
          </View>

          {sessions.map((session, index) => (
            <View key={session.id} className="flex-row items-start gap-3 py-2">
              <View className="w-9 h-9 rounded-xl bg-background border border-border items-center justify-center">
                <Text className="text-primary font-semibold">
                  {DAY_BADGES[index] || session.dayNumber}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-text-primary font-semibold">{session.name}</Text>
                <Text className="text-text-secondary text-xs mt-1">{session.focus}</Text>
                {session.notes ? (
                  <Text className="text-text-muted text-[11px] mt-1">
                    {session.notes}
                  </Text>
                ) : null}
              </View>
              <Text className="text-text-muted text-xs mt-1">
                Ziua {session.dayNumber}
              </Text>
            </View>
          ))}
        </View>
      )}

      {onAssign && (
        <View className="flex-row gap-3 mt-4">
          {onAssign && (
            <Button
              label="Asignează client"
              onPress={() => onAssign(program)}
              className="flex-1"
            />
          )}
        </View>
      )}
    </View>
  );
}
