import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Platform, View, ViewStyle } from "react-native";

const ICON_SIZE = 22;

const ICON_WRAPPER: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
};

const COLORS = {
  focusedBg: "#161A2A",
  background: "#0F111A",
  border: "#1F2434",
  activeTint: "#f798af",
  inactiveTint: "#A3ADC8",
};

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type TabIconProps = {
  name: IoniconName;
  color: string;
  focused: boolean;
};

function TabIcon({ name, color, focused }: TabIconProps) {
  return (
    <View
      style={{
        ...ICON_WRAPPER,
        backgroundColor: focused ? COLORS.focusedBg : "transparent",
        borderWidth: focused ? 1 : 0,
        borderColor: COLORS.border,
      }}
    >
      <Ionicons
        name={name}
        size={ICON_SIZE}
        color={focused ? COLORS.activeTint : color}
      />
    </View>
  );
}

export default function TabLayout() {
  const tabBarStyle: BottomTabNavigationOptions["tabBarStyle"] = Platform.select({
    ios: {
      backgroundColor: COLORS.background,
      borderTopColor: COLORS.border,
      height: 80,
      paddingHorizontal: 12,
      paddingBottom: 16,
      paddingTop: 10,
    },
    default: {
      backgroundColor: COLORS.background,
      borderTopColor: COLORS.border,
      height: 80,
      paddingHorizontal: 12,
      paddingBottom: 12,
      paddingTop: 10,
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.activeTint,
        tabBarInactiveTintColor: COLORS.inactiveTint,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="barbell-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
