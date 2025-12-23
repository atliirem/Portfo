import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

type NewsCardProps = {
  title: string;
  image: string;
  created_at: string;
  id: number;
  horizontal?: boolean;
  city: string;

  onPress?: () => void;
};

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  image,
  created_at,
  horizontal = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, horizontal && styles.cardHorizontal]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={[styles.image, horizontal && styles.imageHorizontal]}
      />
      <View
        style={[styles.textContainer, horizontal && styles.textContainerHorizontal]}
      >
        <Text numberOfLines={3} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.date}>{created_at}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: 195,
    height: 230,
    marginRight: 12,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    elevation: 3,
    paddingHorizontal: 4,
  },
  cardHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    height: 130,
    width: "100%",
  },
  image: {
    padding: 10,
    borderRadius: 8,
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  imageHorizontal: {
    width: 120,
    height: "90%",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textContainerHorizontal: {
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
  },
  date: {
    color: "#777",
    marginTop: 20,
    textAlign: "right",
  },
});
