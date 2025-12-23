import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native'; 
import { ComponentButton } from '../../components/Buttons/componentsButton';
import PropertyMap from '../../components/MapComponents'; 
import Video from "react-native-video"; 

interface MapOrVideosProps {
  locationData: {
    latitude: string;
    longitude: string;
  } | null | undefined;
  videoUrl?: string | null;  
}

export default function MapOrVideos({ locationData, videoUrl }: MapOrVideosProps) {
  const [activeTab, setActiveTab] = useState('Map');

  const tabs = [
    { key: 'Map', label: 'Harita' },
    { key: 'Videos', label: 'Video' },
  ];

  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={40}
      width={155}
      marginTop={4}
      onPress={() => setActiveTab(item.key)}
    />
  );

  return (
    <View style={styles.page}>
     
      <View style={{ height: 60 }}>
        <FlatList
          horizontal
          data={tabs}
          renderItem={renderButton}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonContainer}
        />
      </View>

      <View style={styles.content}>
        {activeTab === 'Map' && (
             <PropertyMap location={locationData} />
        )}

       
        {activeTab === 'Videos' && (
            videoUrl ? (
                <View style={styles.videoContainer}>
                    <Video
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        controls={true}         
                        resizeMode="contain"  
                        paused={false}        
                    />
                </View>
            ) : (
                <View style={styles.videoPlaceholder}>
                    <Text style={{color: '#C4C4C4'}}>Bu ilan için video bulunmuyor.</Text>
                </View>
            )
        )}
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20, 
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  content: {
    paddingHorizontal: 16, 
    minHeight: 10,
  },
 
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000000ff',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10
  },
  video: {
    width: '100%',
    height: '100%',
  },

  videoPlaceholder: {
    height: 20,
    backgroundColor: '#fffcfcff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10
  }
});