import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import BannersCarousel from "../../components/BannersCarousel"

import NewsBanner from '../../components/NewsBanner'
import { SafeAreaView } from 'react-native-safe-area-context'



const Index = () => {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{
          padding: 15, paddingBottom: 120, marginTop: 0
        }}
        showsVerticalScrollIndicator={false}
      >
        <BannersCarousel />

        <NewsBanner />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  header: {
    fontWeight: '800',
    fontSize: 16,

  }
})