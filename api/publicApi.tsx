import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://portfoy.demo.pigasoft.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;

export const forgetPasswordThunk = createAsyncThunk(
  "auth/forgetPassword",
  async (
    params: { email: string; locale?: string },
    { rejectWithValue }
  ) => {
    try {
      console.log(" forgetPassword Request:", {
        url: "/auth/password/reset",
        data: { email: params.email, locale: params.locale ?? "tr" },
      });

      const res = await publicApi.post("/auth/password/reset", {
        email: params.email,
        locale: params.locale ?? "tr",
      });

      console.log(" forgetPassword Response:", res.data);

      if (res.data.status !== "success") {
        throw new Error(res.data.message);
      }

      return res.data;
    } catch (err: any) {
      console.error(" forgetPassword Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      return rejectWithValue(
        err.response?.data?.message || "Şifre sıfırlama başarısız"
      );
    }
  }
);

export const forgetPushNewPasswordThunk = createAsyncThunk(
  "auth/forgetPushNewPassword",
  async (
    {
      token,
      new_password,
    }: {
      token: string;
      new_password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const requestData = {
        token,
        new_password,
        locale: "tr",
      };

      console.log(" forgetPushNewPassword Request:", {
        url: "/auth/password/push",
        data: requestData,
      });

      const res = await publicApi.post("/auth/password/push", requestData);

      console.log("forgetPushNewPassword Response:", {
        status: res.status,
        data: res.data,
      });

      if (res.data.status !== "success") {
        console.error(" API returned non-success status:", res.data);
        throw new Error(res.data.message || "Şifre güncellenemedi");
      }

      return res.data;
    } catch (err: any) {
      console.error(" forgetPushNewPassword Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
        data: err.config?.data,
      });

      
      let errorMessage = "İşlem başarısız";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = "API endpoint bulunamadı";
      } else if (err.response?.status === 422) {
        errorMessage = "Geçersiz veri gönderildi";
      } else if (err.response?.status === 500) {
        errorMessage = "Sunucu hatası";
      } else if (err.message) {
        errorMessage = err.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
