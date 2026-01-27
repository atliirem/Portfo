// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "../src/redux/store";

// const api = axios.create({
//   baseURL: "https://portfoy.demo.pigasoft.com/api",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });


// export const getCountries = createAsyncThunk(
//   "countries/getCountries",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/front/countries`);
//       if (res.data.status !== "success") throw new Error("Ülke kodları alınamadı");
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue("Ülke kodları yüklenemedi");
//     }
//   }
// );


// export const getCities = createAsyncThunk(
//   "cities/getCities",
//   async (countryId: string, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/front/${countryId}/cities`);
//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "Şehirler alınamadı");
//       }
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Şehir listesi alınamadı";
//       return rejectWithValue(msg);
//     }
//   }
// );


// export const getDistrict = createAsyncThunk(
//   "district/getDistrict",
//   async (cityID: string, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/front/${cityID}/districts`);
//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "İlçeler alınamadı");
//       }
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "İlçe listesi alınamadı";
//       return rejectWithValue(msg);
//     }
//   }
// );


// export const getStreet = createAsyncThunk(
//   "street/getStreet",
//   async (districtID: string, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/front/${districtID}/streets`);
//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "Mahalleler alınamadı");
//       }
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Mahalle listesi alınamadı";
//       return rejectWithValue(msg);
//     }
//   }
// );

// // Filtrelenmiş İlanlar
// export const getFilteredProperties = createAsyncThunk(
//   "filteredProperties/getFilteredProperties",
//   async (page: number = 1, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;

//       const { selectedTypes } = state.types;
//       const { selectedCountry } = state.country;
//       const { selectedCity } = state.cities;
//       const { selectedDistrict } = state.district;
//       const { selectedStreet } = state.streets;
//       const { minPrice, maxPrice } = state.price;
//       const { query } = state.search;

//       const params: Record<string, any> = { page };

//       if (query && query.trim()) {
//         params.search = query.trim();
//       }
//       if (selectedTypes && selectedTypes.length > 0) {
//         params.types = selectedTypes.join(",");
//       }
//       if (selectedCountry) params.country_id = selectedCountry;
//       if (selectedCity) params.city_id = selectedCity;
//       if (selectedDistrict) params.district_id = selectedDistrict;
//       if (selectedStreet) params.street_id = selectedStreet;
//       if (minPrice) params.min_price = minPrice;
//       if (maxPrice) params.max_price = maxPrice;

//       console.log("API params:", params);

//       //  Düzeltildi: /front/properties → /properties
//       const res = await api.get("/properties", { params });

//       console.log("API Response:", res.data);

//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "İlanlar alınamadı");
//       }

//       return {
//         data: res.data.data || [],
//         pagination: {
//           currentPage: res.data.current_page || res.data.meta?.current_page || 1,
//           lastPage: res.data.last_page || res.data.meta?.last_page || 1,
//           total: res.data.total || res.data.meta?.total || 0,
//           perPage: res.data.per_page || res.data.meta?.per_page || 10,
//         },
//       };
//     } catch (err: any) {
//       console.log("API Error:", err.response?.data || err.message);
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "İlanlar yüklenemedi";
//       return rejectWithValue(msg);
//     }
//   }
// );