import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Pass from "../../screens/Create/Components/Pass";
import Komisyon from "../../screens/Create/Components/Komisyon";
import { PriceComponentsButton } from "../Buttons/PriceComponentsButton copy";
import { Text } from "react-native";

export default function Price() {
  const [activeTab, setActiveTab] = useState<"pass" | "Komisyon">("pass");

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.text}> Lütfen ilanınızda kullanmak istediğiniz fiyatlandırma tipini seçin.</Text>
  
      <View style={styles.wrapper}>
        <PriceComponentsButton
        
          label="Pass Fiyatı"
          isSelected={activeTab === "pass"}
          height={50}
          width={160}
          onPress={() => setActiveTab("pass")}
        />

        <PriceComponentsButton
          label="Komisyon Fiyatı"
          isSelected={activeTab === "Komisyon"}
          height={50}
          width={160}
          onPress={() => setActiveTab("Komisyon")}
        />
      </View>

 
      <View style={styles.content}>
        {activeTab === "pass" && <Pass />}
        {activeTab === "Komisyon" && <Komisyon />}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 7,
    padding: 1,
    marginBottom: 10,
    alignSelf: "center",
  },

  content: {
    flex: 1,
    marginTop: 10,
  },
  text:{
    color: '#C4C4C4',
    fontWeight: '600',
    fontSize: 12.5,
    marginBottom: 12,
    justifyContent: 'center',
    textAlign: 'center'
  }
});
