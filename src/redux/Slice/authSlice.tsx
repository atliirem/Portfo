import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk, signUpThunk, updateProfile } from "../../../api";

export interface User {
  id: number;
  token: string;
  name: string;
  phone: {
    code: string; 
    number: string;
  };
  email: string;
  avatar?: string;
  roles?: { id: number; title: string }[];
  locale?: {
    key: string;
    title: string;
  };
  unread_notifications_count?: number;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Giriş başarısız";
      })


      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Kayıt başarısız";
      })


      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;

        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Profil güncelleme hatası";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
