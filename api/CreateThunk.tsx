import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "https://portfoy.demo.pigasoft.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@TOKEN");
  console.log("INTERCEPTOR TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;

export const createProperty = async (formData: FormData) => {
  try {
    const response = await api.post(
      "/properties/drafts/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Backend yanıtı:", response.data);
    return response.data;

  } catch (err: any) {
    console.error(" createProperty hatası:", err.response?.data || err);
    throw err.response?.data || err;
  }
};

export const updateProperty = async (propertyId: number, formData: FormData) => {
  try {
    const response = await api.post(
      `/properties/${propertyId}/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Güncelleme başarılı:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("updateProperty hatası:", err.response?.data || err);
    throw err.response?.data || err;
  }
};

export const getPropertyById = createAsyncThunk(
  "properties/getPropertyById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "İlan bulunamadı"
      );
    }
  }
);


