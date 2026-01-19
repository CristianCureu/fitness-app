import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface CongratsOverlayProps {
  visible: boolean;
  message?: string;
  onDone?: () => void;
}

export function CongratsOverlay({ visible, message, onDone }: CongratsOverlayProps) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0.6);
    opacity.setValue(0);

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(700),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      onDone?.();
    });

    return () => {
      animation.stop();
    };
  }, [opacity, onDone, scale, visible]);

  if (!visible) return null;

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/40">
      <Animated.View
        style={{ transform: [{ scale }], opacity }}
        className="bg-surface border border-border rounded-3xl px-6 py-5 items-center"
      >
        <View className="h-14 w-14 rounded-full bg-primary/20 items-center justify-center mb-3">
          <Ionicons name="trophy-outline" size={28} color="#f798af" />
        </View>
        <Text className="text-text-primary text-base font-semibold">Felicitari!</Text>
        <Text className="text-text-secondary text-sm mt-1">
          {message || "Ai facut un pas bun azi."}
        </Text>
      </Animated.View>
    </View>
  );
}

