//category, price(max, min) location( country ,city, district, street ) ve ilan arama


import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "https://portfoy.demo.pigasoft.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
export const getCountries = createAsyncThunk(
  "countries/getCountries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/countries`);
      if (res.data.status !== "success") throw new Error("Ülke kodları alınamadı");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue("Ülke kodları yüklenemedi");
    }
  }
);


export const getCities = createAsyncThunk(
  "cities/getCities",
  async (countryId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/${countryId}/cities`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Şehirler alınamadı");
      }
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Şehir listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const getDistrict = createAsyncThunk(
  "district/getDistrict",
  async (cityID: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/${cityID}/districts`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || " alınamadı");
      }
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
         " listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const getStreet = createAsyncThunk(
  "street/getStreet",
  async (districtID: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/${districtID}/streets`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || " alınamadı");
      }
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
         " listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);