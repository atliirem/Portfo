
import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOMER_KEY = "SELECTED_CUSTOMER";
const PROPERTIES_KEY = "SELECTED_PROPERTIES";
const CURRENCY_KEY = "SELECTED_CURRENCY";


export const saveCustomer = async (customer: { id: number; name: string }) => {
  await AsyncStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
};

export const getCustomer = async () => {
  const data = await AsyncStorage.getItem(CUSTOMER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearCustomer = async () => {
  await AsyncStorage.removeItem(CUSTOMER_KEY);
};


export const saveCurrency = async (currency: { id: number; title: string; code?: string }) => {
  await AsyncStorage.setItem(CURRENCY_KEY, JSON.stringify(currency));
};

export const getCurrency = async () => {
  const data = await AsyncStorage.getItem(CURRENCY_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearCurrency = async () => {
  await AsyncStorage.removeItem(CURRENCY_KEY);
};


export const addProperty = async (property: {
  id: number;
  title: string;
  cover?: string;
  price?: string;
  priceNumber?: number;
}) => {
  const existing = await getProperties();
  const alreadyExists = existing.find((p: any) => p.id === property.id);

  if (!alreadyExists) {

    let numericPrice = property.priceNumber || 0;

    if (!numericPrice && property.price) {
      numericPrice = Number(property.price.replace(/[^0-9]/g, ""));
    }

    const updated = [
      ...existing,
      { ...property, offerPrice: numericPrice },
    ];
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated));
    return true;
  }
  return false;
};

export const removeProperty = async (propertyId: number) => {
  const existing = await getProperties();
  const updated = existing.filter((p: any) => p.id !== propertyId);
  await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updated));
};

export const getProperties = async () => {
  const data = await AsyncStorage.getItem(PROPERTIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearProperties = async () => {
  await AsyncStorage.removeItem(PROPERTIES_KEY);
};

export const clearAllOfferData = async () => {
  await AsyncStorage.multiRemove([CUSTOMER_KEY, PROPERTIES_KEY, CURRENCY_KEY]);
};