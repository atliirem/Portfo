import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Modal from "react-native-modal";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { setSelectedCurrency, clearSelectedCurrency } from "../../redux/Slice/currenciesSlice";
import { getCurrencies, getFilteredProperties } from "../../../api";
import Ionicons from "@react-native-vector-icons/ionicons";
import { clearPrice, setMaxPrice, setMinPrice } from "../../redux/Slice/priceCodeSlice";

const { height: screenHeight } = Dimensions.get("window");

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const PriceFilterModal = ({ isVisible, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { minPrice: storedMin, maxPrice: storedMax } = useAppSelector((s) => s.price);
  const { data: currencies, loading: currenciesLoading, selectedCurrencyId } = useAppSelector(
    (s) => s.currencies
  );

  const [localMin, setLocalMin] = useState("");
  const [localMax, setLocalMax] = useState("");
  const [localCurrencyId, setLocalCurrencyId] = useState<number | null>(null);
  const [showCurrencyList, setShowCurrencyList] = useState(false);

  useEffect(() => {
    if (currencies.length === 0) {
      dispatch(getCurrencies());
    }
  }, [dispatch, currencies.length]);

  useEffect(() => {
    if (isVisible) {
      setLocalMin(storedMin || "");
      setLocalMax(storedMax || "");
      setLocalCurrencyId(selectedCurrencyId);
      setShowCurrencyList(false);
    }
  }, [isVisible, storedMin, storedMax, selectedCurrencyId]);

  const handleClear = async () => {
    setLocalMin("");
    setLocalMax("");
    setLocalCurrencyId(null);
    
    await dispatch(clearPrice());
    await dispatch(clearSelectedCurrency());
    
    // Modal kapandıktan sonra API çağır
    onClose();
    
    setTimeout(() => {
      dispatch(getFilteredProperties(1));
    }, 200);
  };

  const handleApply = async () => {
    await dispatch(setMinPrice(localMin || null));
    await dispatch(setMaxPrice(localMax || null));
    await dispatch(setSelectedCurrency(localCurrencyId));
    
    // Modal kapandıktan sonra API çağır
    onClose();
    
    setTimeout(() => {
      dispatch(getFilteredProperties(1));
    }, 200);
  };

  const handleCurrencySelect = (currency: any) => {
    setLocalCurrencyId(currency.id);
    setShowCurrencyList(false);
  };

  const hasValue = !!localMin || !!localMax || !!localCurrencyId;

  const selectedCurrencyInfo = currencies.find((c) => c.id === localCurrencyId);

  const renderContent = () => (
    <View style={styles.sheet}>
      <View style={styles.dragIndicator} />
      <Text style={styles.title}>Fiyat</Text>

      {showCurrencyList ? (
        <View style={styles.currencyListContainer}>
          <View style={styles.currencyHeader}>
            <TouchableOpacity onPress={() => setShowCurrencyList(false)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.currencyHeaderText}>Para Birimi Seç</Text>
            <View style={{ width: 24 }} />
          </View>

          {currenciesLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#00A7C0" />
            </View>
          ) : (
            <FlatList
              data={currencies}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    localCurrencyId === item.id && styles.currencyItemActive,
                  ]}
                  onPress={() => handleCurrencySelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.currencyItemText,
                      localCurrencyId === item.id && styles.currencyItemTextActive,
                    ]}
                  >
                    {item.title} ({item.symbol})
                  </Text>
                  {localCurrencyId === item.id && (
                    <Ionicons name="checkmark" size={22} color="#00A7C0" />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Para Birimi</Text>
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => setShowCurrencyList(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.currencyText, !localCurrencyId && styles.placeholderText]}>
              {selectedCurrencyInfo
                ? `${selectedCurrencyInfo.title} (${selectedCurrencyInfo.symbol})`
                : "Para birimi seç"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.label}>Minimum Fiyat</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Örn: 100000"
              placeholderTextColor="#999"
              value={localMin}
              onChangeText={setLocalMin}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Maksimum Fiyat</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Örn: 500000"
              placeholderTextColor="#999"
              value={localMax}
              onChangeText={setLocalMax}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.clearButton, !hasValue && styles.disabledButton]}
              onPress={handleClear}
              disabled={!hasValue}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
      propagateSwipe
      avoidKeyboard={Platform.OS === "ios"}
    >
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={10}
          style={styles.keyboardAvoidingView}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      ) : (
        renderContent()
      )}
    </Modal>
  );
};

export default PriceFilterModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: screenHeight * 0.65,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  currencyText: {
    fontSize: 15,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#B0B0B0",
    borderRadius: 10,
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#00A7C0",
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  currencyListContainer: {
    minHeight: 300,
  },
  currencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  currencyHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loaderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  currencyItemActive: {
    backgroundColor: "#E8F7F9",
    borderRadius: 10,
    marginVertical: 2,
  },
  currencyItemText: {
    fontSize: 15,
    color: "#333",
  },
  currencyItemTextActive: {
    color: "#00A7C0",
    fontWeight: "600",
  },
});