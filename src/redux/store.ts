import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";

import authReducer from "./Slice/authSlice";
import propertiesReducer from "./Slice/PropertiesSlice";
import companyReducer from "./Slice/companySlice";
import citiesReducer from "./Slice/citySlice";
import countryReducer from "./Slice/countrySlice";
import districtReducer from "./Slice/districtSlice";
import streetsReducer from "./Slice/streetsSlice";
import offersReducer from "./Slice/offersSlice";
import contactReducer from "./Slice/contactSlice";
import typeReducer from "./Slice/typesSlice";
import featureReducer from "./Slice/featureSlice"
import currenciesReducer from "./Slice/currenciesSlice"
import formReducer, { setExtraFeature } from "./Slice/formSlice";
import imagesReducer from  "./Slice/uploadPhotoSlice"
import videosReducer from "./Slice/uploadVideosSlice"
import subscriptionsReducer from "./Slice/packageSlice"
import propertyActionsReducer from "./Slice/settingsSlice"
import galleryReducer from "./Slice/uploadPhotoSlice"
import priceReducer from "./Slice/priceCodeSlice"
import searchReducer from "./Slice/searchSlice"
import filteredPropertiesReducer from "./Slice/filteredPropertiesSlice"
import createOffersReducer from "./Slice/CreateOffersSlice"



export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    company: companyReducer,
    country: countryReducer,
    cities: citiesReducer,
    district: districtReducer,
    streets: streetsReducer,
    offers: offersReducer,
    contact: contactReducer,
    types: typeReducer,
    features: featureReducer,
    currencies: currenciesReducer,
    form: formReducer,
    images: imagesReducer,
  videos: videosReducer,
  subscriptions: subscriptionsReducer,
  gallery: galleryReducer,
  price: priceReducer,
  search: searchReducer,
  filteredProperties: filteredPropertiesReducer,
  createOffers: createOffersReducer,

// propertyActions: propertyActionsReducer,
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(__DEV__ ? logger : []),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
