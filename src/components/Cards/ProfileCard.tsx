
import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

type ProfileCardProps = {
  title: string;
  image: string;

  onPress?: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  image,
 
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
      />
      <View
        style={styles.textContainer}
      >
        <Text numberOfLines={3} style={styles.title}>
          {title}
        </Text>
       
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;

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
