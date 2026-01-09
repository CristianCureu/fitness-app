import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpScreen() {
  const signUp = useAuthStore((state) => state.signUp);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpForm) => {
      return await signUp(data.email, data.password);
    },
    onSuccess: (result) => {
      if (result.requiresEmailVerification) {
        // Email verification required - show success message
        Alert.alert(
          "Verifică emailul",
          "Cont creat cu succes! Verifică emailul și apasă pe linkul de confirmare pentru a-ți activa contul.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/auth/sign-in"),
            },
          ]
        );
      } else {
        // Instant sign-in - go to app
        Alert.alert("Succes", "Cont creat cu succes!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      }
    },
    onError: (error) => {
      Alert.alert("Înregistrare eșuată", error.message || "A apărut o eroare");
    },
  });

  const onSubmit = (data: SignUpForm) => {
    signUpMutation.mutate(data);
  };

  const handleSignIn = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={["#0F111A", "#131625", "#181C33"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-6 py-14"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-12">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 items-center justify-center">
                <Text className="text-primary font-black text-lg">FX</Text>
              </View>
              <View className="gap-1">
                <Text className="text-xs text-text-muted tracking-[1.5px] font-semibold">
                  FITNESS EXPERIENCE
                </Text>
                <Text className="text-text-secondary text-sm">Construiește ritmul tău.</Text>
              </View>
            </View>
            <Text className="text-4xl font-bold text-text-primary mb-3">
              Creează cont
            </Text>
            <Text className="text-base text-text-secondary">
              Începe-ți parcursul azi
            </Text>
          </View>

          {/* Form */}
          <View>
            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Emailul este obligatoriu",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresă de email invalidă",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="ADRESĂ EMAIL"
                  placeholder="tu@exemplu.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!signUpMutation.isPending}
                  error={errors.email?.message}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Parola este obligatorie",
                minLength: {
                  value: 6,
                  message: "Parola trebuie să aibă minim 6 caractere",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="PAROLĂ"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  editable={!signUpMutation.isPending}
                  error={errors.password?.message}
                  helper={!errors.password ? "Minim 6 caractere" : undefined}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Confirm Password Input */}
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirmă parola",
                validate: (value) => value === password || "Parolele nu coincid",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="CONFIRMĂ PAROLA"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  editable={!signUpMutation.isPending}
                  error={errors.confirmPassword?.message}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Sign Up Button */}
            <Button
              label="Creează cont"
              onPress={handleSubmit(onSubmit)}
              loading={signUpMutation.isPending}
              iconName="person-add-outline"
              fullWidth
              className="mt-5 mb-6"
            />

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-sm text-text-muted">sau</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-text-secondary">Ai deja cont? </Text>
              <Button
                label="Autentificare"
                variant="ghost"
                onPress={handleSignIn}
                disabled={signUpMutation.isPending}
                iconName="log-in-outline"
                className="h-auto px-0 py-0"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
