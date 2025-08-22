import { Tabs, useRouter } from "expo-router";
import { Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const TabsLayout = () => {
  const router = useRouter();
  const { auth } = useAuth();
  useEffect(() => {
    if (!auth.token) {
      router.push("/");
    }
  },[])
  
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true, // Enable showing labels
        tabBarStyle: {
          backgroundColor: "#1b98e0",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 60,
        },
      }}
    >
      <Tabs.Screen
        name="customerAccount"
        options={{
          title: "Customers",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="list-alt"
              size={24}
              color={focused ? "#bde0fe" : "white"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#bde0fe" : "white", // Change title color
                fontSize: 12,
              }}
            >
              Customers
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="user-alt"
              size={24}
              color={focused ? "#bde0fe" : "white"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#bde0fe" : "white", // Change title color
                fontSize: 12,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
