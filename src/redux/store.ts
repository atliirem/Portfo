import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";

import authReducer from "./Slice/authSlice";
import propertiesReducer from "./Slice/PropertiesSlice";
import companyReducer from "./Slice/companySlice";
import citiesReducer from "./Slice/filterSlice";
import countryReducer from "./Slice/countrySlice";
import districtReducer from "./Slice/districtSlice";
import streetsReducer from "./Slice/streetsSlice";
import offersReducer from "./Slice/offersSlice";
import contactReducer from "./Slice/contactSlice";
import typeReducer from "./Slice/typesSlice";
import featureReducer from "./Slice/featureSlice"
import currenciesReducer from "./Slice/currenciesSlice"
import formReducer from "./Slice/formSlice";


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
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(__DEV__ ? logger : []),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
