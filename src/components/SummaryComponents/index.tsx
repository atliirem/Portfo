import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootState, AppDispatch } from "../../redux/store";
import { getCompany, getSummary } from "../../../api";
import { ProfileButton } from "../../components/Buttons/profileButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/Navbar/ProfileStack";

import Ionicons from "react-native-vector-icons/Ionicons";


type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const SummaryComponents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { company, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  const counts = company?.summary?.counts || [];

  useEffect(() => {
    dispatch(getCompany());
    dispatch(getSummary());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Kullanıcı bulunamadı.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView   style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scroll}
       showsVerticalScrollIndicator={false}>
        {company && (
          <>
         
            <View style={styles.grayCard}>
              <View style={styles.companyHeader}>
                {company.logo && (
                  <Image
                    source={{ uri: company.logo }}
                    style={styles.companyLogo}
                  />
                )}
                <View>
                  <Text style={styles.companyName}>{company.name}</Text>
                  <Text style={styles.companyType}>{company.type}</Text>
                  <Text style={styles.companyDate}>{company.created_at}</Text>
                </View>
              </View>

              <View style={styles.profileSection}>
                {company.website && (
                  <Text style={styles.profileItem}>{company.website}</Text>
                )}
                {company.email && (
                  <Text style={styles.profileItem}>{company.email}</Text>
                )}
                {company.phone && (
                  <Text style={styles.profileItem}>{company.phone}</Text>
                )}
              </View>

              <View style={styles.buttonGroup}>
                <ProfileButton
                  label="Firma Düzenle"
                  bg="#29c5d3"
                  color="white"
                  width={320}
                  height={33}
                  marginTop={0}
                />
                <ProfileButton
                  label="Portföyüm"
                  bg="#1a8b95"
                  color="white"
                  width={320}
                  height={33}
                  marginTop={4}
                  onPress={()=> navigation.navigate('MyPortfoy')}
                />
                <ProfileButton
                  label="Aboneliği Yönet"
                  bg="#c4c4c4ff"
                  color="white"
                  width={320}
                  height={33}
                  marginTop={4}
                />
              </View>
            </View>

        
            <View style={styles.grayCard}>
              <View style={styles.countCardContainer}>
                {counts.map((item: any, index: number) => (
                  <View key={index} style={styles.countCard}>
                    <Ionicons
                    name="search"
                    size={22}
                    color={'#9f9e9eff'}
                    style={{ margin: 7, top: 8 }}
                      // name="text-box-search-outline"
                      // size={22}
                      // color="#9f9e9eff"
                      // style={{ margin: 7, top: 8 }}
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.countTitle}>{item.title}</Text>
                      <Text style={styles.countValue}>{item.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
        <Text>Kategorisine Göre İlanlar</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SummaryComponents;

const styles = StyleSheet.create({
  scroll:{
        paddingBottom: 50 ,
        marginLeft: 20,
        marginRight: 20
  }
  ,
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },


  grayCard: {
    backgroundColor: "#F6F6F6",
    borderRadius: 14,
    padding: 18,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },

  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
    backgroundColor: "#EAEAEA",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  companyType: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  companyDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  profileSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#E0E0E0",
  },
  profileItem: {
    fontSize: 13.5,
    color: "#333",
    marginBottom: 5,
  },
  buttonGroup: {
    marginTop: 10,
    alignItems: "center",
  },


  countCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  countCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  countTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#5C5C5C",
    marginBottom: 5,
    textTransform: "capitalize",
    marginLeft: -32,
  },
  countValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "black",
    letterSpacing: 0.3,
  },
});
