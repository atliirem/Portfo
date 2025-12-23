import React, { useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../../navigation/RootStack";
import { useAppDispatch } from "../../redux/Hooks";
import { getProperties } from "../../../api";
import Video from "react-native-video";
import { RootState } from "../../redux/store";





export const VideoComponents: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch(); 
  const { discountedList, latestList, property, loading } = useSelector(
    (state: RootState) => state.properties
  );

 
  useEffect(() => {
    dispatch(getProperties(id));
  }, [id]);


  const previewItem = discountedList.find((p) => p.id === id) || latestList.find((p) => p.id === id);

  const detailItem = (property && property.id === id) ? property : null;

  const displayItem = detailItem || previewItem;

  if (!displayItem) {
    return (
      <View style={styles.center}>
        {loading ? (
           <ActivityIndicator size="large" color="#1a8b95" />
        ) : (
           <Text style={styles.emptyText}>İlan bulunamadı</Text>
        )}
      </View>
    );
  }
return( 
  <Video
    source={{ uri: displayItem.videos }}
    style={{ width: '100%', aspectRatio: 16 / 9 }}
    controls
  />
)}
