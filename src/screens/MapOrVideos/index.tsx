import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native'; 
import PropertyMap from '../../components/MapComponents'; 
import Video from "react-native-video"; 
import { ComponentButtonOffers } from '../../components/Buttons/componentsButtonOffers';

interface MapOrVideosProps {
  locationData: {
    latitude: string;
    longitude: string;
  } | null | undefined;
  videoUrl?: string | null;
  editable?: boolean; 
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function MapOrVideos({ 
  locationData, 
  videoUrl, 
  editable = false,  
  onLocationChange   
}: MapOrVideosProps) {
  const [activeTab, setActiveTab] = useState('Map');

  // Kontrolü kaldırdık - butonlar her zaman görünecek

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <ComponentButtonOffers
          label="Harita Konumu"
          isSelected={activeTab === 'Map'}
          height={40}
          width={155}
          onPress={() => setActiveTab('Map')}
        />
        <ComponentButtonOffers
          label={`Videolar (${videoUrl ? 1 : 0})`}
          isSelected={activeTab === 'Videos'}
          height={40}
          width={155}
          onPress={() => setActiveTab('Videos')}
        />
      </View>

      <View style={styles.content}>
        {activeTab === 'Map' && (
          <PropertyMap 
            location={locationData} 
            editable={editable}
            onLocationChange={onLocationChange}
          />
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
              <Text style={styles.placeholderText}>Bu ilan için video bulunmuyor.</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  content: {
    // Parent zaten padding veriyor
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    height: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
});