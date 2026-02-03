import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { loadAuth } from "../redux/Slice/authSlice";

export default function Appk({ children }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    dispatch(loadAuth()).finally(() => {
      setIsInitializing(false);
    });
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }

  return children;
}