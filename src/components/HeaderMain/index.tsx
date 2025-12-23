import React from 'react';
import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from './style';


const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1, top: 50, }}>
      <View style={styles.headerMain}>
        <View style={styles.headerOne}>
          <Image
            style={styles.image}
            source={{ uri: 'https://cdn.getir.com/misc/emoji/house.png' }}
          />
          <View style={styles.headerOneView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={styles.homeText}>EV</Text>
              <Text style={styles.addressText}>Dedepaşa Blv. Yenişehir Sitesi</Text>
            </View>
            <AntDesign name="right" size={20} color="black" style={styles.icon} />
          </View>
          <View style={styles.headerTwo}>
            <Text style={{ fontSize: 12,fontWeight: 'bold', color: '#5D3EBD'}}>TVS </Text>
            <Text style={{ fontSize:20,fontWeight: 'bold', color: '#5D3EBD'}}>13dk </Text>

          </View>
        </View>
       
      </View>
    </SafeAreaView>
  );
};

export default Index;
