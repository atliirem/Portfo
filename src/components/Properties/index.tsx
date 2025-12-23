// import React, { useEffect } from "react";
// import { View, Text, ActivityIndicator } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { getProperties } from "../../../api";
// import { RootState, AppDispatch } from "../../redux/store";

// const Properties = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { newsList, loading, errorNews } = useSelector(
//     (state: RootState) => state.properties
//   );

//   useEffect(() => {
//     dispatch(getProperties(id)); 
//   }, [dispatch]);

//   if (loading) return <ActivityIndicator size="large" color="#25C5D1" />;
//   if (errorNews) return <Text>{errorNews}</Text>;
//   if (!item) return <Text>İlan bulunamadı</Text>;

//   return (
//     <View>
//       <Text>{item.title}</Text>
//       <Text>{item.price?.formatted}</Text>
//     </View>
//   );
// };

// export default Properties;
