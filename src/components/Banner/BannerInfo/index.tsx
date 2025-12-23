import { StyleSheet, View, FlatList, Image, Dimensions, TouchableOpacity, Button, Text } from 'react-native';
import React, { useState } from 'react';

const { width, height } = Dimensions.get('window');

const Index = () => {

  const [banners, setBanners] = useState<string[]>([
    "Apartman Bilgileri", "Konum ve Tesis Bilgileri",  "Yasal Bilgiler", 
  ]);
    const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  return (

    <View style={styles.container}>
      <FlatList
  data={banners}
  horizontal
  keyExtractor={(item) => item}
  contentContainerStyle={{ paddingHorizontal: 10, marginBottom: 12 }}
  renderItem={({ item }) => {
      const isSelected = selectedBanner === item;
    return(
      <TouchableOpacity
                 style={[
                   styles.button,
                   { backgroundColor: isSelected ? '#ffffffff' : '#E5E5E5' }
                 ]}
                 onPress={() => setSelectedBanner(item)}
               >
                 <Text
                   style={[
                     styles.buttonText,
                     { color: isSelected ? '#000000ff' : '#737373ff' }
                   ]}
                 >
                   {item}
                 </Text>
               </TouchableOpacity>
  )}}
/> 
    </View>

  );
};

export default Index;

const styles = StyleSheet.create({
   container: {
    marginVertical: 80,
    top: -90,
    right: 7
  },
  button: {
    padding: 5,
    width: 138,
    marginHorizontal: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:0.6,
    borderColor: '#D0D0D0'
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});