import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUpdateMyProfile } from "@/lib/hooks/queries/use-clients";

export default function EditProfileScreen() {
  const router = useRouter();
  const appUser = useAuthStore((state) => state.appUser);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const updateMyProfile = useUpdateMyProfile();

  const clientProfile = appUser?.clientProfile;

  const [firstName, setFirstName] = useState(clientProfile?.firstName || "");
  const [lastName, setLastName] = useState(clientProfile?.lastName || "");
  const [age, setAge] = useState(clientProfile?.age ? String(clientProfile.age) : "");
  const [height, setHeight] = useState(
    clientProfile?.height ? String(clientProfile.height) : ""
  );
  const [weight, setWeight] = useState(
    clientProfile?.weight ? String(clientProfile.weight) : ""
  );
  const [goalDescription, setGoalDescription] = useState(
    clientProfile?.goalDescription || ""
  );
  const [recommendedSessions, setRecommendedSessions] = useState(
    clientProfile?.recommendedSessionsPerWeek
      ? String(clientProfile.recommendedSessionsPerWeek)
      : ""
  );
  const [timezone, setTimezone] = useState(clientProfile?.timezone || "UTC");
//kahunas.io 
  const handleSave = () => {
    updateMyProfile.mutate(
      {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        age: age ? Number(age) : undefined,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        goalDescription: goalDescription.trim() || undefined,
        recommendedSessionsPerWeek: recommendedSessions
          ? Number(recommendedSessions)
          : undefined,
        timezone: timezone.trim() || undefined,
      },
      {
        onSuccess: async () => {
          await refreshUser();
          Alert.alert("Succes", "Profil actualizat.");
          router.back();
        },
        onError: (error) => {
          Alert.alert(
            "Eroare",
            error instanceof Error ? error.message : "Nu am putut salva."
          );
        },
      }
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-secondary text-sm mb-2">Tu</Text>
        <Text className="text-text-primary text-3xl font-bold">Editează profilul</Text>
      </View>

      <View className="px-6 pb-10">
        <FormInput
          label="Prenume"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ex: Andrei"
        />
        <FormInput
          label="Nume"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Ex: Popescu"
          containerClassName="mt-3"
        />
        <FormInput
          label="Vârstă"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Ex: 28"
          containerClassName="mt-3"
        />
        <FormInput
          label="Înălțime (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholder="Ex: 178"
          containerClassName="mt-3"
        />
        <FormInput
          label="Greutate (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="Ex: 78"
          containerClassName="mt-3"
        />
        <FormInput
          label="Obiectiv"
          value={goalDescription}
          onChangeText={setGoalDescription}
          placeholder="Ex: -6kg în 3 luni"
          containerClassName="mt-3"
        />
        <FormInput
          label="Sesiuni / săpt."
          value={recommendedSessions}
          onChangeText={setRecommendedSessions}
          keyboardType="numeric"
          placeholder="Ex: 3"
          containerClassName="mt-3"
        />
        <FormInput
          label="Timezone"
          value={timezone}
          onChangeText={setTimezone}
          placeholder="Ex: Europe/Bucharest"
          containerClassName="mt-3"
        />

        <View className="flex-row gap-3 mt-6">
          <Button
            label="Anulează"
            variant="ghost"
            iconName="close-outline"
            onPress={() => router.back()}
            className="flex-1"
          />
          <Button
            label="Salvează"
            iconName="save-outline"
            onPress={handleSave}
            loading={updateMyProfile.isPending}
            disabled={updateMyProfile.isPending}
            className="flex-1"
          />
        </View>
      </View>
    </ScrollView>
  );
}

