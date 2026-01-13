import React, { useCallback, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { AppDispatch } from "../../../redux/store";
import { useAppSelector } from "../../../redux/Hooks";
import { getMyProperties, getCompanyProperties } from "../../../../api";
import FirstCard from "../../../components/Cards/FirstCard";
import { RootStackParamList } from "../../../navigation/RootStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  companyId?: number;
};

interface PaginationProps {
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    paginationText?: string;
  };
  loading: boolean;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, loading, onChange }) => {
  const { currentPage, lastPage, paginationText } = pagination;

  if (lastPage <= 1) return null;

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1, "...", lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <Text key={`dots-${index}`} style={styles.dots}>
            ...
          </Text>
        );
      }

      const pageNum = page as number;
      const isActive = pageNum === currentPage;

      return (
        <TouchableOpacity
          key={pageNum}
          style={[styles.pageNumber, isActive && styles.pageNumberActive]}
          onPress={() => !loading && onChange(pageNum)}
          disabled={loading || isActive}
        >
          <Text style={[styles.pageNumberText, isActive && styles.pageNumberTextActive]}>
            {pageNum}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.paginationWrapper}>
      {paginationText && <Text style={styles.paginationText}>{paginationText}</Text>}

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage <= 1 && styles.pageButtonDisabled]}
          onPress={() => onChange(currentPage - 1)}
          disabled={loading || currentPage <= 1}
        >
          <Ionicons name="chevron-back" size={18} color={currentPage <= 1 ? "#ccc" : "#333"} />
        </TouchableOpacity>

        <View style={styles.pageNumbers}>{renderPageNumbers()}</View>

        <TouchableOpacity
          style={[styles.pageButton, currentPage >= lastPage && styles.pageButtonDisabled]}
          onPress={() => onChange(currentPage + 1)}
          disabled={loading || currentPage >= lastPage}
        >
          <Ionicons name="chevron-forward" size={18} color={currentPage >= lastPage ? "#ccc" : "#333"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PropertiesScreenProfile: React.FC<Props> = ({ companyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();


  const { myList, loadingMyList, myListPagination } = useAppSelector(
    (state) => state.properties
  );

  const { companyProperties, loadingProperties, companyPropertiesPagination } = useAppSelector(
    (state) => state.company
  );


  const properties = companyId ? companyProperties : myList;
  const loading = companyId ? loadingProperties : loadingMyList;
  const pagination = companyId 
    ? (companyPropertiesPagination || { currentPage: 1, lastPage: 1, total: 0, perPage: 10, paginationText: "" })
    : myListPagination;

  const [refreshing, setRefreshing] = useState(false);
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 3000;

  const fetchProperties = useCallback(
    async (page: number = 1, force = false) => {
      const now = Date.now();
      if (!force && now - lastFetchTime.current < MIN_FETCH_INTERVAL) return;

      lastFetchTime.current = now;

      try {
        if (companyId) {
          await dispatch(getCompanyProperties({ companyId, page })).unwrap();
        } else {
          await dispatch(getMyProperties(page)).unwrap();
        }
      } catch (err) {
        console.error("İlanlar alınamadı:", err);
      }
    },
    [dispatch, companyId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchProperties(1);
    }, [fetchProperties])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties(1, true);
    setRefreshing(false);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.lastPage && !loading) {
      fetchProperties(page, true);
    }
  };

  const renderCard = ({ item }: any) => (
    <FirstCard
      title={item.title}
      updated_at={item.updated_at}
      image={item.cover}
      creator={item.creator}
      price={item.price?.formatted ?? ""}
      tag={item.discounted ? "Fiyatı Düştü" : null}
      status={item.status}
      type={item.type?.title}
      city={item.city?.title}
      district={item.district?.title}
      onPress={() => navigation.navigate("MyPropertiesDetailScreen", { id: item.id })}
      videos={[]}
    />
  );

  if (loading && properties.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#25C5D1" />
        <Text style={styles.emptyText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!loading && properties.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>İlan bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, marginTop: -230 }}>
      <View style={styles.container}>
        <Text style={styles.header}>
          İlanlar ({pagination.total || properties.length})
        </Text>

        <FlatList
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#25C5D1" />
          }
          ListFooterComponent={
            pagination.lastPage > 1 ? (
              <Pagination pagination={pagination} loading={loading} onChange={goToPage} />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default PropertiesScreenProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginTop: 230,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 16,
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  paginationWrapper: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  paginationText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 3,
  },
  pageButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  pageNumber: {
    minWidth: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 3,
    backgroundColor: "#f5f5f5",
  },
  pageNumberActive: {
    backgroundColor: "#25C5D1",
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  pageNumberTextActive: {
    color: "#fff",
  },
  dots: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 5,
  },
});