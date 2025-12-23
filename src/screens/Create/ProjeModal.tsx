// // imports
// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   ScrollView,
//   TouchableOpacity,
//   Button,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import TextInputUser from "../../components/TextInput/TextInputUser";
// import Modal from "react-native-modal";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../redux/store";
// import { useAppSelector } from "../../redux/Hooks";
// import { getCountries, getCities, getDistrict, getStreet } from "../../../api/filterThunk";
// import { getCurrencies, getTypes } from "../../../api";
// import { setSelectedCurrency as setSelectedCurrencyRedux } from "../../redux/Slice/currenciesSlice";
// import Location from "./Location";


// const ArsaModal = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const [title, setTitle] = useState("");
//   const [adress, setAdress] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");


//   const [categoryModalVisible, setCategoryModalVisible] = useState(false);


//   const [currencyModalVisible, setCurrencyModalVisible] = useState(false);




//   const [selectedCurrencyLocal, setSelectedCurrencyLocal] = useState("");

//   const { data: currencies, loading: currenciesLoading, error: currenciesError } =
//     useAppSelector((state) => state.currencies);
 
//   useEffect(() => {
//     dispatch(getCurrencies());
//   }, [dispatch]);

 

//   const selectCurrencyHandler = (currencyTitle: string, currencyId: string) => {
//     setSelectedCurrencyLocal(currencyTitle);
//     dispatch(setSelectedCurrencyRedux(currencyId));
//     setCurrencyModalVisible(false);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>


//           <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10, }}>
//             <View style={{ width: '48%', marginRight: 20 }}>
//               <TextInputUser
//                 placeholder="Pass fiyatını girin" value={adress} onChangeText={setAdress} />
//             </View>
//             <View style={{ width: '49%', marginLeft: -10, }} >
//               <TextInputUser
//                 placeholder="Satış fiyatını girin" value={adress} onChangeText={setAdress} />
//             </View>
//           </View>
//           <View style={styles.button}>
//             <TouchableOpacity  >
//               <Text style={{ color: '#fff', fontWeight: '700', }}>Yeni İlan Oluştur</Text>
//             </TouchableOpacity>
//           </View>
        

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ArsaModal;

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#fff" },
//   scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
//   section: { marginTop: 0, },
//   sectionHeader: { fontSize: 14, fontWeight: "700", color: "#25C5D1", marginBottom: 12 },
   
//   modal: { margin: 0, justifyContent: "flex-end" },
//   modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 12, maxHeight: "80%" },
//   modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 14, justifyContent: 'center', textAlign: 'center' },
//   categoryItem: {
//     paddingVertical: 12, borderBottomWidth: 1,
//     borderColor: "#ddd",
//   },
//   button: {
//     width: '100%',
//     height: 45,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#bfbebeff',
//     borderRadius: 6.5,
//     marginTop: 20,

//   },

//   textInput: {

//   }
// });
