import React, { useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "../../../redux/Hooks"; 
import Ionicons from "react-native-vector-icons/Ionicons";

import BannerPhoto from "../../../components/Banner/BannerPhoto";

import PropertiesButton from "../../../components/Buttons/PropertiesButton";
import { BannerDetail } from "../../../components/Banner/BannerDetail";
import MapOrVideos from "../../MapOrVideos";
import { getProperties } from "../../../../api";
import { Image } from "react-native-elements";

type Props = NativeStackScreenProps<RootStackParamList, "PropertiesDetailScreen">;

const PropertiesDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch(); 
  const { discountedList, latestList, property, loading } = useSelector(
    (state: RootState) => state.properties
  );

 
  useEffect(() => {
    dispatch(getProperties(id));
  }, [id]);


  const previewItem = discountedList.find((p) => p.id === id) || latestList.find((p) => p.id === id);

  const detailItem = (property && property.id === id) ? property : null;

  const displayItem = detailItem || previewItem;

  if (!displayItem) {
    return (
      <View style={styles.center}>
        {loading ? (
           <ActivityIndicator size="large" color="#1a8b95" />
        ) : (
           <Text style={styles.emptyText}>İlan bulunamadı</Text>
        )}
      </View>
    );
  }


  console.log("AKTİF GÖSTERİLEN VERİ:", JSON.stringify(displayItem, null, 2));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
     
        <View style={styles.imageContainer}>
          <BannerPhoto id={id} />
          <View style={styles.iconContainer}>
            <PropertiesButton item={displayItem} />
          </View>
        </View>

  
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{displayItem.title}</Text>

          <View style={styles.content}>
            <View style={{flexDirection: 'row',  }}>
            <Ionicons name="location-outline" color={'#C4C4C4'} size={15} />
            <Text style={styles.location}>
               {displayItem.city?.title} / {displayItem.district?.title}
            </Text>
          </View>

      
          {displayItem.updated_at && (
             <View style={{flexDirection:'row', alignItems:'center',}}>
                <Ionicons name="time-outline" color={'#C4C4C4'} size={15} />
                <Text style={{color:'#C4C4C4', marginLeft:5, fontSize:14}}>
                  {displayItem.updated_at}
                </Text>
             </View>
          )}
          </View>

       
          <View style={styles.priceContainer}>
            <View style={styles.priceHeaderRow}>
              <Text style={styles.priceLabel}>Pass Fiyatı</Text>
              <Text style={styles.priceLabel}>Satış Fiyatı</Text>
            </View>
            <View style={styles.priceRow}>
              
              <Text style={styles.price}>{displayItem.prices?.secondary.formatted}</Text>

              <Text style={styles.price}>{displayItem.prices?.primary.formatted}</Text>
            </View>
          </View>

        
          <BannerDetail id={id} />
        </View>



        <View>
       
          {detailItem ? (
             <MapOrVideos locationData={detailItem.map} />
          ) : loading ? (
             <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#1a8b95" />
                <Text style={{color:'#999', marginTop:10}}>Harita yükleniyor...</Text>
             </View>
          ) : null}
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', borderWidth:1, borderColor: '#C4C4C4' ,  borderRadius: 6, padding: 10, margin: 10, }}>
             <Image style={{width: 40, height: 40, borderRadius: 30,  marginTop: 10,}}
            source={{uri: displayItem.company.logo}}/>
            <View style={{flexDirection: 'column', marginTop: 10}}>
              <Text style={{color: '#AFAFAF', fontSize: 12.5,}}>İlan Sahibi</Text>
             <Text style={{color: 'black', fontWeight: '500', fontSize: 15}}>{displayItem.company.title}</Text>
             </View>

             <Ionicons  style={{marginTop: 15}}
             name="chevron-forward-outline" size={30} color={'#a9a9a9ff'}/>
        </View>

       
        {/* <View>
        
          <MapOrVideos locationData={detailItem?.map} />
        </View> */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertiesDetailScreen;


const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingBottom: 65 },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  iconContainer: {
    position: "absolute",
    top: -10,
    left: -18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
    marginTop: 40
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F9C43E",
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
  location: {
    color: "#C4C4C4",
    fontSize: 15,
    fontWeight: '500',
  }
});