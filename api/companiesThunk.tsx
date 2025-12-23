import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const api = axios.create({
  baseURL: 'https://portfoy.demo.pigasoft.com/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@TOKEN');


  if (token && typeof token === 'string') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// export const getCompanyProperties = createAsyncThunk(
//   'myProperties/getmyProperties',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.post('/auth/properties');
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.errors?.body?.[0] ||
//         err?.message ||
//         'Article alınamadı';
//       return rejectWithValue(msg);
//     }
//   }
// );


