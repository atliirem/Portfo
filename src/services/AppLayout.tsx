import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "./AuthService";
import { setUserFromStorage } from "../redux/Slice/authSlice";
import { AppDispatch, RootState } from "../redux/store";

export default function AppLayout({ children }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AuthService.getUser();
        
        if (storedUser) {
          console.log("Stored user found:", storedUser.email);
          dispatch(setUserFromStorage(storedUser));
        } else {
          console.log("No stored user found");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

