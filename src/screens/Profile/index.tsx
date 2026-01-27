import React, { useEffect, useState } from "react";
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
import { getCompany } from "../../../api";
import { AccountItems } from "../../components/Buttons/AccountButton";
import { ProfileButton } from "../../components/Buttons/profileButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/Navbar/ProfileStack"; 
import LogoutModal from "../../components/Modal/LogoutModal";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { company, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  useEffect(() => {
    dispatch(getCompany());
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
    <SafeAreaView style={styles.container}>
      <ScrollView  style={styles.scrollView}>

        <View style={styles.infoBox}>
          {user.avatar && (
            <Image
              source={{
                uri: user.avatar.includes("svg")
                  ? user.avatar.replace("format=svg", "format=png")
                  : user.avatar,
              }}
              style={styles.avatar}
            />
          )}
          <View style={styles.textbox}>
            <Text style={styles.header}>Hoş geldiniz</Text>
            <Text style={styles.value}>{user.name}</Text>
            {user.roles?.length ? (
              <Text style={styles.valueOrange}>{user.roles[0].title}</Text>
            ) : null}
          </View>
        </View>


        {company && (
          <View style={styles.companyCard}>
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
              {/* {company.score && (
                <Text style={styles.profileItem}>
                  ⭐ Firma Puanı: {company.score}
                </Text>
              )}
              <Text style={styles.profileItem}>Kod: {company.code}</Text> */}
            </View>

            
            <View style={styles.buttonGroup}>
              <View style={{ flexDirection: "row" }}>
                <ProfileButton
                  label="Firma Özeti"
                  bg="#F9C43E"
                  color="black"
                  width={155}
                  height={33}
                  marginTop={0}
                  onPress={() => navigation.navigate("SummaryScreen")}
                />
                <ProfileButton
                  label="Firma Düzenle"
                  bg="#25C5D1"
                  color="white"
                  width={155}
                  height={33}
                  marginTop={0}
                   onPress={() => navigation.navigate("EditCompany")}

                />
              </View>

              <ProfileButton
                label="Portföyüm"
                bg="#1a8b95"
                color="white"
                width={320}
                height={33}
                marginTop={4}
                onPress={()=> navigation.navigate('MyPortfoy' as never)}
              />
              <ProfileButton
                label="Aboneliği Yönet"
                bg="#c4c4c4ff"
                color="white"
                width={320}
                height={33}
                marginTop={4}
                 onPress={()=> navigation.navigate('MySubscriptionsScreen' as never)}
              />
            </View>
          </View>
        )}

  
        <Text style={styles.sectionHeader}>Hesabım</Text>
        <AccountItems
          label="İlanlarım"
          onPress={() => navigation.navigate("PropertiesScreenProfile" as never)}
        />
        <AccountItems
          label="Müşteriye Gönderilen Teklifler"
          onPress={() => navigation.navigate("CustomerOffers")}
        />
        <AccountItems
          label="Fiyat Tekliflerim"
          onPress={() => navigation.navigate("Offers")}
        />
        <AccountItems label="Favorilerim" onPress={()=> navigation.navigate("Favorite" as never)} />
        <AccountItems
          label="Bildirimlerim"
          onPress={() => navigation.navigate("DetailAlertsScreen")}
        />
        <AccountItems
          label="Profil Bilgilerini Güncelle"
          onPress={() => navigation.navigate("EditProfileScreen")}
        />
        <AccountItems
          label="Şifre Değiştir"
          onPress={() => navigation.navigate("ChangePassword")}
        />
        <AccountItems label="Dil Seçimi" />
       <AccountItems
  label="Çıkış Yap"
  onPress={() => setLogoutModalVisible(true)}
/>

<LogoutModal
  visible={logoutModalVisible}
  onClose={() => setLogoutModalVisible(false)}
/>
        <AccountItems label="Hesabımı Sil" color="red" />


        <Text style={styles.sectionHeader}>Kurumsal</Text>
        <AccountItems
          label="Firmalar"
          onPress={() => navigation.navigate("Company" as never)}
        />
        <AccountItems
          label="İletişim"
          onPress={() => navigation.navigate("Contact")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: -55, 
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderColor: "#ccc",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textbox: {
    marginLeft: 15,
  },
  header: {
    fontSize: 13,
    color: "#888",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  valueOrange: {
    color: "#F9C43E",
    fontWeight: "600",
  },
  companyCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    marginBottom: 25,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
  },
  companyType: {
    fontSize: 14,
    color: "#666",
  },
  companyDate: {
    fontSize: 12,
    color: "#999",
  },
  profileSection: {
    marginTop: 15,
  },
  profileItem: {
    fontSize: 13,
    color: "#333",
    marginBottom: 3,
  },
  buttonGroup: {
    marginTop: 15,
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00A7C0",
    marginTop: 20,
    marginBottom: 10,
  },
  scrollView:{
   paddingBottom: 187,
  }

});


