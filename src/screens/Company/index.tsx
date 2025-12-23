import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";

import { ComponentButton } from "../../components/Buttons/componentsButton";
import PropertiesScreenProfile from "../../screens/Detail/DetailPropertiesProfile";
import TeamScreen from "../../components/Team/TeamCompınents";
import CustomerScreen from "../../components/Customer";
import CompaniesCard from "../../components/Cards/CompaniesCard";

import { getAllCompanies } from "../../../api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";
import CompanyTeamComponents from "../../components/Team/CompanyComponents";

type Props = NativeStackScreenProps<RootStackParamList, "CompaniesScreen">;

 const CompaniesScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const { company } = useSelector((state: RootState) => state.company);

  const [activeTab, setActiveTab] = useState("myPortfoy");

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);


  const selectedCompany = company.find((c) => c.id === id);

  if (!selectedCompany) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Firma bulunamadı.</Text>
      </View>
    );
  }

  const tabs = [
    { key: "myPortfoy", label: "Portföyüm" },
    { key: "team", label: "Ekip" },
    { key: "location", label: "Konum" },
  ];

  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={40}
      width={110}
      marginTop={0}
      onPress={() => setActiveTab(item.key)}
    />
  );

  return (
    <View style={styles.page}>
      

      <View style={{height: 40,  }}>
        <CompaniesCard
          id={selectedCompany.id}
          title={selectedCompany.name}
          image={selectedCompany.logo}
          type={selectedCompany.type}
          city={selectedCompany.properties?.[0]?.city?.title}
        />
      </View>


      <FlatList
        horizontal
        data={tabs}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonContainer}
      />


      <View style={styles.content}>
        {activeTab === "myPortfoy" && <PropertiesScreenProfile />}
        {activeTab === "team" && <CompanyTeamComponents/>}
        {activeTab === "location" && < PropertiesScreenProfile/>}
      </View>
    </View>
  );
};

export default CompaniesScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 10,
    gap: 10,
    marginBottom: 10,
    marginTop: 70,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});