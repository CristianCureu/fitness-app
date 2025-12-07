import { Text, View } from "react-native";

interface AuthHeaderProps {
  title?: string;
  description?: string;
}

export default function AuthHeader({
  title = "Create Account",
  description = "Start your fitness journey today",
}: AuthHeaderProps) {
  return (
    <View className="mb-12">
      <View className="flex-row items-center gap-3 mb-4">
        <View className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 items-center justify-center">
          <Text className="text-primary font-black text-lg">FX</Text>
        </View>
        <View className="gap-1">
          <Text className="text-xs text-text-muted tracking-[1.5px] font-semibold">
            FITNESS EXPERIENCE
          </Text>
          <Text className="text-text-secondary text-sm">Build momentum today.</Text>
        </View>
      </View>
      <Text className="text-4xl font-bold text-text-primary mb-3">{title}</Text>
      <Text className="text-base text-text-secondary">{description}</Text>
    </View>
  );
}
