import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  titles: string[];             
  onSelect?: (title: string) => void;  
}

const TabButtons: React.FC<Props> = ({ titles, onSelect }) => {
  const [active, setActive] = useState<string>(titles[0] || "");

  const handleSelect = (title: string) => {
    setActive(title);
    onSelect && onSelect(title);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {titles.map((title) => {
        const isActive = active === title;

        return (
          <TouchableOpacity
            key={title}
            onPress={() => handleSelect(title)}
            style={[
              styles.button,
              { backgroundColor: isActive ? "#25C5D1" : "#E5E5E5" }
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isActive ? "#fff" : "#333" }
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  }
});

export default TabButtons;