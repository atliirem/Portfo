import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NotificationCardProps = {
  id: number;
  content: string;
  time_diff: string;
  onPress?: () => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  content,
  time_diff,
  onPress,
}) => {
  const [isRead, setIsRead] = useState(false);

  
  useEffect(() => {
    const loadReadState = async () => {
      try {
        const stored = await AsyncStorage.getItem("@READ_NOTIFICATIONS");
        const readIds = stored ? JSON.parse(stored) : [];
        if (readIds.includes(id)) {
          setIsRead(true);
        }
      } catch (e) {
        console.log("Okundu kontrol hatası:", e);
      }
    };
    loadReadState();
  }, [id]);


  const handlePress = async () => {
    try {
      const stored = await AsyncStorage.getItem("@READ_NOTIFICATIONS");
      const readIds = stored ? JSON.parse(stored) : [];

      if (!readIds.includes(id)) {
        readIds.push(id);
        await AsyncStorage.setItem("@READ_NOTIFICATIONS", JSON.stringify(readIds));
      }
      setIsRead(true);
    } catch (e) {
      console.log("Okundu kaydetme hatası:", e);
    }

    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.card, isRead && styles.cardRead]}
    >
      <View style={styles.inner}>
        <Text style={styles.notification}>{content}</Text>
        {time_diff ? (
          <Text style={styles.time_diff}>{time_diff}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F9C43E",
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
    elevation: 2,
    width: "100%",
    alignSelf: "center",
    minHeight: 60,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    justifyContent: "center",
    padding: 10,
  },
  cardRead: {
    backgroundColor: "#d9d9d9",
  },
  inner: {
    flexDirection: "column",
  },
  notification: {
    fontSize: 13,
    color: "#000",
    flexWrap: "wrap",
  },
  time_diff: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },
});