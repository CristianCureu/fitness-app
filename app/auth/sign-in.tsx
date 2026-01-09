import AuthLogo from "@/components/ui/auth-header";
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

interface SignInForm {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const signIn = useAuthStore((state) => state.signIn);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInForm) => {
      await signIn(data.email, data.password);
    },
    onSuccess: () => {
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      Alert.alert("Autentificare eșuată", error.message || "A apărut o eroare");
    },
  });

  const onSubmit = (data: SignInForm) => {
    signInMutation.mutate(data);
  };

  const handleSignUp = () => {
    router.push("/auth/sign-up");
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
          <AuthLogo
            title="Bine ai revenit"
            description="Autentifică-te ca să continui parcursul tău"
          />

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
                  editable={!signInMutation.isPending}
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
                  editable={!signInMutation.isPending}
                  error={errors.password?.message}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Sign In Button */}
            <Button
              label="Autentificare"
              onPress={handleSubmit(onSubmit)}
              loading={signInMutation.isPending}
              iconName="log-in-outline"
              fullWidth
              className="mt-5 mb-6"
            />

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-sm text-text-muted">sau</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-text-secondary">Nu ai cont?</Text>
              <Button
                label="Creează cont"
                variant="ghost"
                onPress={handleSignUp}
                disabled={signInMutation.isPending}
                iconName="person-add-outline"
                className="h-auto px-0 py-0"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
