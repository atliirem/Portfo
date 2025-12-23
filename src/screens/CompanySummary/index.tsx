import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ComponentButton } from "../../components/Buttons/componentsButton";
import MyOffers from "../../components/OffersComponents/MyOffers";
import SentOffers from "../../components/OffersComponents/SentOffers";
import SummaryComponents from "../../components/SummaryComponents"
import ProposalsComponents from "../../components/ProposalsComponents";



export default function SummaryScreen() {
  const [activeTab, setActiveTab] = useState<"summary" | "proposals">("summary");

  return (
    <View style={styles.page}>
      <View style={styles.buttonContainer}>
        <ComponentButton
          label="Firma Özeti"
          isSelected={activeTab === "summary"}
          height={40}
          width={165}
          marginTop={10}
          onPress={() => setActiveTab("summary")}
        />
        <ComponentButton
          label="İlanlar"
          isSelected={activeTab === "proposals"}
          height={40}
          width={165}
          marginTop={10}
          onPress={() => setActiveTab("proposals")}
        />
      </View>

      <View style={styles.content}>
        {activeTab === "summary" && <SummaryComponents />}
        {activeTab === "proposals" && <ProposalsComponents />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: -5,
  },
  content: {
    flex: 1,
    
  },
});
