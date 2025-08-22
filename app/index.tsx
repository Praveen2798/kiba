import { View, ActivityIndicator } from "react-native";
import LoginOne from "@/components/LoginOne";
import { checkTokenValidity } from "@/config/checkTokenValidity";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevent setting state on unmounted component

    const validateToken = async () => {
      const isValid = await checkTokenValidity();
      if (isValid) {
        // Fetch all AsyncStorage values in parallel
        const [token, name, email] = await Promise.all([
          AsyncStorage.getItem("accessToken"),
          AsyncStorage.getItem("name"),
          AsyncStorage.getItem("email"),
        ]);

        if (isMounted) {
          setAuth({ token, name, email });
          router.replace("/customerAccount"); // Redirect if token is valid
        }
      } else if (isMounted) {
        setCheckingToken(false); // Show login only if token is invalid
      }
    };

    validateToken();

    return () => {
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, []);

  // Show Activity Indicator while checking the token
  if (checkingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return <LoginOne />;
}
