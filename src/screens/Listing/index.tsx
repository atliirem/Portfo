import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import FilterScreen from '../FilterScreen';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import FirstCard from '../../components/Cards/FirstCard';
import { getFilteredProperties } from '../../../api';

import { clearSelectedTypes } from '../../redux/Slice/typesSlice';
import { setSelectedCountry } from '../../redux/Slice/countrySlice';
import { setSelectedCity } from '../../redux/Slice/citySlice';
import { setSelectedDistrict } from '../../redux/Slice/districtSlice';
import { setSelectedStreet } from '../../redux/Slice/streetsSlice';

import { clearSearchQuery } from '../../redux/Slice/searchSlice';
import { resetFilteredProperties } from '../../redux/Slice/filteredPropertiesSlice';
import { clearPrice } from '../../redux/Slice/priceCodeSlice';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Index = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();

  const { data: properties, loading, error, pagination } = useSelector(
    (state: RootState) => state.filteredProperties
  );

  const { selectedTypes } = useSelector((state: RootState) => state.types);
  const { selectedCountry } = useSelector((state: RootState) => state.country);
  const { minPrice, maxPrice } = useSelector((state: RootState) => state.price);
  const { query } = useSelector((state: RootState) => state.search);

  const isFilterActive =
    (selectedTypes && selectedTypes.length > 0) ||
    !!selectedCountry ||
    !!minPrice ||
    !!maxPrice ||
    !!query;

  useEffect(() => {
    dispatch(getFilteredProperties(1));
  }, [dispatch]);

  const handleClearAllFilters = () => {
    dispatch(clearSelectedTypes());
    dispatch(setSelectedCountry(null));
    dispatch(setSelectedCity(null));
    dispatch(setSelectedDistrict(null));
    dispatch(setSelectedStreet(null));
    dispatch(clearPrice());
    dispatch(clearSearchQuery());
    dispatch(resetFilteredProperties());
    setTimeout(() => {
      dispatch(getFilteredProperties(1));
    }, 100);
  };


  const handleNextPage = () => {
    if (!loading && pagination.currentPage < pagination.lastPage) {
      dispatch(getFilteredProperties(pagination.currentPage + 1));
    }
  };


  const handlePrevPage = () => {
    if (!loading && pagination.currentPage > 1) {
      dispatch(getFilteredProperties(pagination.currentPage - 1));
    }
  };


  const handleGoToPage = (page: number) => {
    if (!loading && page >= 1 && page <= pagination.lastPage) {
      dispatch(getFilteredProperties(page));
    }
  };

  const renderCard = ({ item }: { item: any }) => (
    <FirstCard
      title={item.title}
      videos={item?.videos}
      image={item.cover}
      price={item.price?.formatted ?? ""}
      tag={item.discounted ? "Fiyatı Düştü" : null}
      company={item.company?.title}
      type={item.type?.title}
      city={item.city?.title}
      district={item.district?.title}
      onPress={() => navigation.navigate('PropertiesDetailScreen', { id: item.id })}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="home-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>
          {isFilterActive ? "Filtreye uygun ilan bulunamadı" : "Henüz ilan yok"}
        </Text>
        {isFilterActive && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={handleClearAllFilters}>
            <Text style={styles.clearFiltersText}>Filtreleri Temizle</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };


  const renderPagination = () => {
    if (pagination.lastPage <= 1) return null;

    const pages: number[] = [];
    const currentPage = pagination.currentPage;
    const lastPage = pagination.lastPage;


    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(lastPage, currentPage + 2);


    if (currentPage <= 2) {
      endPage = Math.min(5, lastPage);
    }
    if (currentPage >= lastPage - 1) {
      startPage = Math.max(1, lastPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <View style={styles.paginationContainer}>

        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={handlePrevPage}
          disabled={currentPage === 1 || loading}
        >
          <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#ccc" : "#00A7C0"} />
        </TouchableOpacity>


        {startPage > 1 && (
          <>
            <TouchableOpacity style={styles.pageButton} onPress={() => handleGoToPage(1)}>
              <Text style={styles.pageButtonText}>1</Text>
            </TouchableOpacity>
            {startPage > 2 && <Text style={styles.dots}>...</Text>}
          </>
        )}


        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            style={[styles.pageButton, currentPage === page && styles.pageButtonActive]}
            onPress={() => handleGoToPage(page)}
            disabled={loading}
          >
            <Text
              style={[styles.pageButtonText, currentPage === page && styles.pageButtonTextActive]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}


        {endPage < lastPage && (
          <>
            {endPage < lastPage - 1 && <Text style={styles.dots}>...</Text>}
            <TouchableOpacity style={styles.pageButton} onPress={() => handleGoToPage(lastPage)}>
              <Text style={styles.pageButtonText}>{lastPage}</Text>
            </TouchableOpacity>
          </>
        )}


        <TouchableOpacity
          style={[styles.pageButton, currentPage === lastPage && styles.pageButtonDisabled]}
          onPress={handleNextPage}
          disabled={currentPage === lastPage || loading}
        >
          <Ionicons name="chevron-forward" size={20} color={currentPage === lastPage ? "#ccc" : "#00A7C0"} />
        </TouchableOpacity>
      </View>
    );
  };


  const renderPageInfo = () => (
    <View style={styles.pageInfoContainer}>
      <Text style={styles.pageInfoText}>
        Sayfa {pagination.currentPage} / {pagination.lastPage} • Toplam {pagination.total} ilan
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FilterScreen />


      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          İlanlar {pagination.total > 0 && `(${pagination.total})`}
        </Text>

        <View style={styles.rightContainer}>
          {isFilterActive && (
            <TouchableOpacity style={styles.resetButton} onPress={handleClearAllFilters}>
              <Text style={styles.reset}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      {loading && properties.length === 0 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#00A7C0" />
          <Text style={styles.loadingText}>İlanlar yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(getFilteredProperties(1))}
          >
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>

          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={loading ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#00A7C0" />
              </View>
            ) : null}
          />


          {pagination.total > 0 && renderPageInfo()}


          {renderPagination()}
        </>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 70,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00A7C0',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    justifyContent: 'center',
    marginRight: 10,
  },
  reset: {
    color: '#00A7C0',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 10,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#999',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 16,
  },
  clearFiltersButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00A7C0',
    borderRadius: 8,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  retryText: {
    color: '#00A7C0',
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
  },

  // Sayfalama Stilleri
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pageButtonActive: {
    backgroundColor: '#00A7C0',
    borderColor: '#00A7C0',
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  dots: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 4,
  },
  pageInfoContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  pageInfoText: {
    fontSize: 13,
    color: '#666',
  },
});
