// ProposalsDetail.tsx
import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

import { ComponentButton } from "../../../components/Buttons/componentsButton";
import { DetailScreen } from "../DetailScreens";
import TeamScreen from "../../../components/Team/TeamScreen";

export default function ProposalsDetail() {
  const route = useRoute<any>();
  const { id, code } = route.params;

  const [activeTab, setActiveTab] =
    useState<"detail" | "rating">("detail");

  const tabs = [
    { key: "detail", label: "Teklif Detayı" },
    { key: "rating", label: "Değerlendirme" },
  ];

  return (
    <View style={styles.page}>
      <FlatList
        horizontal
        data={tabs}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        renderItem={({ item }) => (
          <ComponentButton
            label={item.label}
            isSelected={activeTab === item.key}
            width={160}
            height={40}
            onPress={() => setActiveTab(item.key)}
          />
        )}
      />

      <View style={styles.content}>
        {activeTab === "detail" && (
          <DetailScreen id={id} code={code} />
        )}
        {activeTab === "rating" && <TeamScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  tabs: { paddingHorizontal: 12, gap: 10 },
  content: { flex: 1 },
});
