import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TeamScreen from "../../Team/TeamScreen";
import { ComponentButtonOffers } from "../../Buttons/componentsButtonOffers";


const OffersDetailTab = () => {
  return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
};

const TABS = [
  { key: "detail", label: "Portföyüm" },
  { key: "score", label: "Ekip" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type TabItem = (typeof TABS)[number];

export default function OfffersDetail() {
  const [activeTab, setActiveTab] = useState<TabKey>("detail");

  const renderButton = useCallback(
    ({ item }: { item: TabItem }) => (
      <ComponentButtonOffers
        label={item.label}
        isSelected={activeTab === item.key}
        height={40}
        width={105}
        marginTop={14}
        onPress={() => setActiveTab(item.key)}
      />
    ),
    [activeTab]
  );

  const renderContent = () => {
    switch (activeTab) {
      case "detail":
        return <OffersDetailTab />;
      case "score":
        return <TeamScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe} >
      <View style={styles.page}>
        <View style={styles.tabsWrapper}>
          <FlatList
            horizontal
            data={TABS}
            renderItem={renderButton}
            keyExtractor={(item) => item.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonContainer}
          />
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  
  
  },
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabsWrapper: {
     height: 60,                
    justifyContent: "center",  
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 10,
    gap: 10,
    
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
