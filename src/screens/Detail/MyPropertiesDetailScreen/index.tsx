// import React, { useCallback, useState } from "react";
// import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../../navigation/RootStack";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAppDispatch } from "../../../redux/Hooks"; 
// import Ionicons from "@react-native-vector-icons/ionicons";

// import BannerPhoto from "../../../components/Banner/BannerPhoto";
// import MyPropertiesButton from "../../../components/Buttons/MyPropertiesButton";
// import { BannerDetail } from "../../../components/Banner/BannerDetail";
// import PropertyMap from "../../../components/MapComponents"; 
// import { getProperties, getPropertyFeatures } from "../../../../api";
// import { Image } from "react-native-elements";
// import { useFocusEffect } from "@react-navigation/native";
// import MapOrVideos from "../../MapOrVideos";

// type Props = NativeStackScreenProps<RootStackParamList, "MyPropertyDetailScreen">;

// const MyPropertyDetailScreen: React.FC<Props> = ({ route, navigation }) => {
//   const { id } = route.params;
//   const dispatch = useAppDispatch(); 
  
//   const { myList, property, loading } = useSelector(
//     (state: RootState) => state.properties
//   );

//   const form = useSelector((state: RootState) => state.form);

//   const [retryCount, setRetryCount] = useState(0);

//   useFocusEffect(
//     useCallback(() => {
//       const fetchData = async () => {
//         try {
//           await dispatch(getProperties(id)).unwrap();
//           await dispatch(getPropertyFeatures(id)).unwrap();
//         } catch (error: any) {
//           if (error?.includes?.("Too Many") || error?.includes?.("429")) {
//             if (retryCount < 3) {
//               setTimeout(() => setRetryCount(prev => prev + 1), 3000);
//             }
//           }
//         }
//       };
//       fetchData();
//     }, [id, dispatch, retryCount])
//   );

//   const previewItem = myList.find((p) => p.id === id);
//   const detailItem = (property && property.id === id) ? property : null;

//   const formFallback = (form.propertyId === id) ? {
//     id: form.propertyId,
//     title: form.title || "Başlık yok",
//     city: { title: form.location?.cityName || "" },
//     district: { title: form.location?.districtName || "" },
//     street: { title: form.location?.streetsName || "" },
//     country: { title: form.location?.countryName || "" },
//     prices: {
//       primary: { formatted: form.pass?.salePrice ? `₺${form.pass.salePrice}` : "" },
//       secondary: { formatted: form.pass?.passPrice ? `₺${form.pass.passPrice}` : "" },
//     },
//     type: { 
//       id: form.selectedSubCategoryId || form.selectedCategoryId,
//       title: form.selectedSubCategory || form.selectedCategory || ""
//     },
//     company: null,
//     updated_at: new Date().toLocaleDateString('tr-TR'),
//   } : null;

//   const displayItem = detailItem || previewItem || formFallback;

//   if (!displayItem) {
//     return (
//       <View style={styles.center}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#1a8b95" />
//         ) : (
//           <Text style={styles.emptyText}>İlan bulunamadı</Text>
//         )}
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scroll}>
        
//         <View style={styles.imageContainer}>
//           <BannerPhoto id={id} />
//           <View style={styles.iconContainer}>
//             <MyPropertiesButton item={displayItem} />
//           </View>
//         </View>

//         <View style={styles.contentContainer}>
//           <Text style={styles.title}>{displayItem.title}</Text>

//           <View style={styles.content}>
//             <View style={{flexDirection: 'row'}}>
//               <Ionicons name="location-outline" color={'#C4C4C4'} size={15} />
//               <Text style={styles.location}>
//                 {displayItem.city?.title} / {displayItem.district?.title}
//               </Text>
//             </View>

//             {displayItem.updated_at && (
//               <View style={{flexDirection:'row', alignItems:'center'}}>
//                 <Ionicons name="time-outline" color={'#C4C4C4'} size={15} />
//                 <Text style={{color:'#C4C4C4', marginLeft:5, fontSize:14}}>
//                   {displayItem.updated_at}
//                 </Text>
//               </View>
//             )}
//           </View>
          
//           <View style={styles.priceContainer}>
//             <View style={styles.priceHeaderRow}>
//               <Text style={styles.priceLabel}>Pass Fiyatı</Text>
//               <Text style={styles.priceLabel}>Satış Fiyatı</Text>
//             </View>
//             <View style={styles.priceRow}>
//               <Text style={styles.price}>{displayItem.prices?.secondary?.formatted}</Text>
//               <Text style={styles.price}>{displayItem.prices?.primary?.formatted}</Text>
//             </View>
//           </View>

//           <BannerDetail id={id} />
//         </View>

     
//         <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
//          {/* Harita ve Video */}
// {detailItem?.map && (
//   <MapOrVideos locationData={detailItem.map} editable={false} />
// )}
//         </View>

//         {displayItem.company && (
//           <View style={styles.companyContainer}>
//             <Image style={styles.companyLogo} source={{uri: displayItem.company.logo}} />
//             <View style={{flexDirection: 'column', marginTop: 10}}>
//               <Text style={{color: '#AFAFAF', fontSize: 12.5}}>İlan Sahibi</Text>
//               <Text style={{color: 'black', fontWeight: '500', fontSize: 15}}>
//                 {displayItem.company.title}
//               </Text>
//             </View>
//             <Ionicons style={{marginTop: 15}} name="chevron-forward-outline" size={30} color={'#a9a9a9ff'} />
//           </View>
//         )}

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default MyPropertyDetailScreen;

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#fff" },
//   scroll: { paddingBottom: 65 },
//   imageContainer: { position: "relative", width: "100%", height: 400 },
//   iconContainer: { position: "absolute", top: -10, left: -18, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 10, zIndex: 10 },
//   contentContainer: { paddingHorizontal: 16, paddingTop: 20 },
//   title: { fontSize: 23, fontWeight: "500", color: "#000", marginBottom: 12, marginTop: 40 },
//   content: { marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   priceContainer: { marginBottom: 20 },
//   priceHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
//   priceLabel: { fontSize: 15, fontWeight: "600", color: "#333" },
//   priceRow: { flexDirection: "row", justifyContent: "space-between" },
//   price: { fontSize: 20, fontWeight: "800", color: "#F9C43E" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   emptyText: { fontSize: 16, color: "#666" },
//   location: { color: "#C4C4C4", fontSize: 15, fontWeight: '500' },
//   companyContainer: { flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#C4C4C4', borderRadius: 6, padding: 10, margin: 10 },
//   companyLogo: { width: 40, height: 40, borderRadius: 30, marginTop: 10 },
// });