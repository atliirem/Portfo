// import React, { useState } from 'react';
// import { View, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import { ComponentButton } from '../../../../components/Buttons/componentsButton';
// import { useAppSelector, useAppDispatch } from '../../../../redux/Hooks';
// import { useRoute, RouteProp } from '@react-navigation/native';
// import TaslakInfo from '../../Components/TaslakInfo';
// import PropertyMap from '../../../../components/MapComponents';
// import EditProperty from '../../../Edit/EditProperty';
// import SettingsScreen from '../SettingsScreen';
// import OffersComponentsScreen from '../OffersComponentsScreen';
// import GalleryScreen from '../../../GalleryScreen';
// import { updatePropertyLocation } from '../../../../../api';

// interface MapOrVideosProps {
//   locationData: {
//     latitude: string;
//     longitude: string;
//   } | null | undefined;
//   videoUrl?: string | null;
//   propertyId?: number; 
// }

// type RouteParams = {
//   Taslak: { propertyId?: number; id?: number };
// };

// export default function Taslak({ locationData, propertyId: propId }: MapOrVideosProps) {
//   const [activeTab, setActiveTab] = useState('Property');
//   const dispatch = useAppDispatch();
  
//   const route = useRoute<RouteProp<RouteParams, 'Taslak'>>();
//   const { property } = useAppSelector((state) => state.properties);
//   const { propertyId: formPropertyId } = useAppSelector((state) => state.form);
  
//   const propertyId = 
//     propId || 
//     route.params?.propertyId || 
//     route.params?.id || 
//     property?.id || 
//     formPropertyId ||
//     0;

//   const tabs = [
//     { key: 'Property', label: 'Property' },
//     { key: 'Location', label: 'Location' },
//     { key: 'Gallery', label: 'Gallery' },
 
//   ];

//   const handleLocationChange = (lat: number, lng: number) => {
//     if (!propertyId) {
//       Alert.alert("Hata", "İlan ID bulunamadı");
//       return;
//     }
    
//     dispatch(updatePropertyLocation({ 
//       propertyId, 
//       latitude: lat, 
//       longitude: lng 
//     }))
//       .unwrap()
//       .then(() => {
//         Alert.alert("Başarılı", "Konum güncellendi");
//       })
//       .catch((err) => {
//         Alert.alert("Hata", err || "Konum güncellenemedi");
//       });
//   };

//   const renderButton = ({ item }: any) => (
//     <ComponentButton
//       label={item.label}
//       isSelected={activeTab === item.key}
//       height={40}
//       width={113}
//       marginTop={4}
//       onPress={() => setActiveTab(item.key)}
//     />
//   );

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'Property':
//         return <EditProperty />;
//       case 'Location':
//         return (
//           <View style={styles.mapContainer}>
//             <PropertyMap 
//               location={locationData} 
//               editable={true}
//               onLocationChange={handleLocationChange}  
//             />
//           </View>
//         );
//       case 'Gallery':
//         return <GalleryScreen propertyId={propertyId} />;
//       case 'Teklifler':
//         return <OffersComponentsScreen propertyId={propertyId} />;
//       case 'Ayarlar':
//         return <SettingsScreen propertyId={propertyId} />;
//       case 'Haraketler':
//         return <View style={styles.placeholder}></View>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={styles.page}>
      
//       <TaslakInfo propertyId={propertyId} />
      
      
//       <View style={styles.tabsWrapper}>
//         <FlatList
//           horizontal
//           data={tabs}
//           renderItem={renderButton}
//           keyExtractor={(item) => item.key}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.buttonContainer}
//         />
//       </View>


//       <View style={styles.content}>
//         {renderTabContent()}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     backgroundColor: '#fff',
    
//   },
//   tabsWrapper: {
//     backgroundColor: '#fff',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   buttonContainer: {
//     paddingHorizontal: 10,
//     gap: 8,
//   },
//   content: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   mapContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   placeholder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });