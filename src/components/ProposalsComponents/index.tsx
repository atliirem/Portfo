import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootState, AppDispatch } from "../../redux/store";
import { getCompany, getSummary } from "../../../api";

const ProposalsComponents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { company, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  const properties = company?.summary?.properties|| [];

  useEffect(() => {
    dispatch(getCompany());
    dispatch(getSummary());
  }, [dispatch]);

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  if (!user)
    return (
      <View style={styles.center}>
        <Text>Kullanıcı bulunamadı.</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 10 }}>
          {properties.length > 0 ? (
            properties.map((item: any) => (
              <View key={item.id} style={styles.card}>
                   <Text style={styles.location}>{item.creator}</Text>
                <View style={styles.cardHeader}>
                 
                  <Text style={styles.title}>{item.title}</Text>  
                   

                </View>
                
                <View style={{flexDirection: 'column',  }}>
                  <Text style={styles.location}>{item.location}</Text>
                  <Text style={styles.infoBoxValueprice}>{item.price}</Text>
               
</View>

       
                <View style={styles.cardInfoGrid}>
                  <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Kategori</Text>
                    <Text style={styles.infoBoxValue}>{item.type}</Text>
                  </View>

                 
                  

                   <View style={styles.infoBox}>
                  
                    <Text style={styles.infoBoxText}>İlan Durumu</Text>
                    <Text style={styles.infoBoxValue}>   {item.status.title}</Text>
                  </View> 

                  <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Görüntüleme</Text>
                    <Text style={styles.infoBoxValue}>{item.views}</Text>
                  </View>

                  <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Favori</Text>
                    <Text style={styles.infoBoxValue}>{item.favorites}</Text>
                  </View>
                  <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Değerlendirme</Text>
                    <Text style={styles.infoBoxValue}>{item.score.total}</Text>
                  </View>


                  <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Teklif</Text>
                    <Text style={styles.infoBoxValue}>{item.proposals}</Text>
                  </View>
                   <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Güncelleme Tarihi</Text>
                    <Text style={styles.infoBoxValue}>{item.created_at}</Text>
                  </View>

                   <View style={styles.infoBox}>
                   
                    <Text style={styles.infoBoxText}>Oluşturulma Tarihi</Text>
                    <Text style={styles.infoBoxValue}>{item.updated_at}</Text>
                  </View>
                  
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>Henüz ilan bulunmuyor.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProposalsComponents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { color: "#D32F2F", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  marginTop: 6
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,

  },
  infoBox: {
    width: "30%",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e7e7e7ff",
    
  },
  infoBoxValueprice:{
 width: "100%",
    fontWeight: '800',
    fontSize: 19,
    marginTop: 5,
    color: '#F9C43E',
  
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
   
  
   
    
   
  },
  location:
  {
     width: "60%",
    fontWeight: '600',
    color: '#c0c0c0',
    fontSize:12

   
  },
  infoBoxText: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
  },
  infoBoxValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
});
