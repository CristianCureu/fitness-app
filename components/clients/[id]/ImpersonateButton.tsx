import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface ImpersonateButtonProps {
  clientId: string;
}

export function ImpersonateButton({ clientId }: ImpersonateButtonProps) {
  return (
    <View className="mt-6">
      <Button
        label="Deschide ca client"
        onPress={() =>
          router.push({ pathname: "/(tabs)/clients/[id]/client-view", params: { id: clientId } })
        }
        fullWidth
      />
      <Text className="text-text-muted text-xs text-center mt-2">
        Impersonare simplă pentru a vedea exact ce vede clientul în app.
      </Text>
    </View>
  );
}
