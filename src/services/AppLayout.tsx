import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { AuthService } from "../services/AuthService";
import { setUserFromStorage } from "../redux/Slice/authSlice";



export default function Appk({ children }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    AuthService.getUser()
      .then((storedUser) => {
        dispatch(setUserFromStorage(storedUser));
      })
      .finally(() => setIsInitializing(false));
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
