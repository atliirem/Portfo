// import React from "react";
// import { View, Text, ScrollView } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";

// export const FeatureList = () => {
//   const { groups, loading } = useSelector((state: RootState) => state.features);

//   if (loading) return <Text>Yükleniyor...</Text>;

//   return (
//     <ScrollView style={{ padding: 16 }}>
//       {groups.map((group, gIndex) => (
//         <View key={gIndex} style={{ marginBottom: 20 }}>
        
//           {/* <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 8 }}>
//             {group.title}
//           </Text> */}

   
//           {group.features.map((feat) => (
//             <Text
//               key={feat.id}
//               style={{
//                 fontSize: 16,
//                 paddingVertical: 4,
//                 color: "#333",
//               }}
//             >
//               {feat.title}: {feat.value || "-"}
//             </Text>
//           ))}
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// export default FeatureList;
