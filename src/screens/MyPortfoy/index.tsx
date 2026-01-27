import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComponentButton } from '../../components/Buttons/componentsButton';

import TeamScreen from '../../components/Team/TeamScreen'; 
import CustomerScreen from '../../components/Customer';
import PropertiesScreenProfile from '../../screens/Detail/DetailPropertiesProfile';
import { CustomerOffers } from '../../screens/Detail/CustomerOffers';

const TABS = [
  { key: 'myPortfoy', label: 'Portföyüm' },
  { key: 'team', label: 'Ekip' },
  { key: 'customer', label: 'Müşteriler' },
  { key: 'offers', label: 'Teklifler' },
] as const;

type TabKey = typeof TABS[number]['key'];
type TabItem = typeof TABS[number];

export default function MyPortfoy() {
  const [activeTab, setActiveTab] = useState<TabKey>('team');
  const [isReady, setIsReady] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsReady(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsReady(true), 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTab]);

  const renderButton = useCallback(({ item }: { item: TabItem }) => {
    return (
      <ComponentButton
        label={item.label}
        isSelected={activeTab === item.key}
        height={40}
        width={105}
        marginTop={4}
        onPress={() => setActiveTab(item.key)}
      />
    );
  }, [activeTab]);

  const renderContent = () => {
    if (!isReady) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#25C5D1" />
        </View>
      );
    }

    switch (activeTab) {
      case 'myPortfoy':
        return <PropertiesScreenProfile />;
      case 'team':
        return <TeamScreen />;
      case 'customer':
        return <CustomerScreen />;
      case 'offers':
        return <CustomerOffers />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>

      <View style={styles.page}>
        <View style={styles.tabsWrapper}>
          <FlatList
            horizontal
            data={TABS}
            renderItem={renderButton}
            keyExtractor={(item) => item.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonContainer}
          />
        </View>

        <View style={styles.content}>
          {renderContent()}
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonContainer: {
    paddingHorizontal: 10,
    gap: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
