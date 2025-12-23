// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";

// const DropdownSelect = ({
//   label,
//   placeholder,
//   value,
//   onSelect,
//   apiUrl, 
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState(value || null);

//   useEffect(() => {
//     if (modalVisible) {
//       loadData();
//     }
//   }, [modalVisible]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(apiUrl);
//       // API yapına göre ayarla:
//       // örnek: response.data.data veya response.data.results
//       setOptions(response.data);
//     } catch (err) {
//       console.error("DropdownSelect API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {label && <Text style={styles.label}>{label}</Text>}

//       <TouchableOpacity
//         style={styles.selectBox}
//         onPress={() => setModalVisible(true)}
//         activeOpacity={0.8}
//       >
//         <Text style={[styles.valueText, !selected && styles.placeholder]}>
//           {selected || placeholder}
//         </Text>
//       </TouchableOpacity>


//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>{label}</Text>

//             {loading ? (
//               <ActivityIndicator size="large" color="#00A3A3" />
//             ) : (
//               <FlatList
//                 data={options}
//                 keyExtractor={(item, index) =>
//                   item.id?.toString() || index.toString()
//                 }
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.optionItem}
//                     onPress={() => setSelected(item.name || item)}
//                   >
//                     <Text style={styles.optionText}>{item.name || item}</Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             )}

//             <TouchableOpacity
//               style={styles.applyButton}
//               onPress={() => {
//                 setModalVisible(false);
//                 onSelect(selected);
//               }}
//             >
//               <Text style={styles.applyButtonText}>Uygula</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { marginBottom: 12 },
//   label: {
//     fontSize: 14,
//     color: "#00A3A3",
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   selectBox: {
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     backgroundColor: "#fff",
//   },
//   valueText: { fontSize: 15, color: "#333" },
//   placeholder: { color: "#999" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 16,
//     maxHeight: "60%",
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#00A3A3",
//     marginBottom: 12,
//   },
//   optionItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   optionText: { fontSize: 15, color: "#333" },
//   applyButton: {
//     backgroundColor: "#00A3A3",
//     borderRadius: 8,
//     alignItems: "center",
//     paddingVertical: 12,
//     marginTop: 16,
//   },
//   applyButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
// });

// export default DropdownSelect;