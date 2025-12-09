import { useAuthStore } from "@/lib/stores/auth-store";
import { UserRole } from "@/lib/types/api";
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

type TabConfig = {
  name: string;
  title: string;
  icon: IoniconName;
  roles?: UserRole[];
  hidden?: boolean;
};

export default function TabLayout() {
  const role = useAuthStore((s) => s.appUser?.role);
  const tabs: TabConfig[] = [
    { name: "index", title: "Home", icon: "home", roles: ["CLIENT"] },
    { name: "workouts", title: "Workouts", icon: "barbell-outline", roles: ["CLIENT"] },
    { name: "clients", title: "Clients", icon: "people", roles: ["TRAINER"] },
    {
      name: "programs",
      title: "Programe",
      icon: "clipboard-outline",
      roles: ["TRAINER"],
    },
    {
      name: "schedule",
      title: "Programări",
      icon: "calendar-outline",
      roles: ["TRAINER"],
    },
    {
      name: "invites",
      title: "Invites",
      icon: "mail-unread-outline",
      roles: ["TRAINER"],
    },
    { name: "profile", title: "Profile", icon: "person" },
  ];

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
      {tabs.map((tab) => {
        const isAllowed = !tab.roles || (role && tab.roles.includes(role));

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              href: isAllowed ? undefined : null,
              tabBarIcon:
                isAllowed && !tab.hidden
                  ? ({ color, focused }) => (
                      <TabIcon name={tab.icon} color={color} focused={focused} />
                    )
                  : undefined,
            }}
          />
        );
      })}
    </Tabs>
  );
}
