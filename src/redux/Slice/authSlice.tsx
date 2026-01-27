import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  loginThunk, 
  signUpThunk, 
  updateProfile, 
  logoutThunk, 
  changePasswordThunk,
  verifyPasswordCodeThunk 
} from "../../../api";

export interface User {
  id: number;
  token: string;
  name: string;
  phone: { code: string; number: string };
  email: string;
  avatar?: string;
  roles?: { id: number; title: string }[];
  locale?: { key: string; title: string };
  unread_notifications_count?: number;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;  
  loading: boolean;
  error: string | null;
  passwordChangeLoading: boolean;
  passwordChangeError: string | null;
  passwordChangeSuccess: boolean;
  verifyCodeLoading: boolean;
  verifyCodeError: string | null;
  verifyCodeSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,  
  loading: false,
  error: null,
  passwordChangeLoading: false,
  passwordChangeError: null,
  passwordChangeSuccess: false,
  verifyCodeLoading: false,
  verifyCodeError: null,
  verifyCodeSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPasswordChangeState: (state) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = null;
      state.passwordChangeSuccess = false;
      state.verifyCodeLoading = false;
      state.verifyCodeError = null;
      state.verifyCodeSuccess = false;
    },
    setUserFromStorage: (state, action: PayloadAction<User>) => {
      console.log("setUserFromStorage reducer called with:", action.payload);
      state.user = action.payload;
      state.token = action.payload?.token || null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
        state.token = action.payload?.token || null;
        console.log("Login successful, user set:", action.payload.email);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Giriş başarısız";
      })

      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
        state.token = action.payload?.token || null;
        console.log("SignUp successful, user set:", action.payload.email);
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Kayıt başarısız";
      })

      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;  
        state.error = null;
        console.log("Logout successful");
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null; 
        state.error = action.payload as string;
      })

      .addCase(changePasswordThunk.pending, (state) => {
        state.passwordChangeLoading = true;
        state.passwordChangeError = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = null;
        state.passwordChangeSuccess = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = action.payload as string;
        state.passwordChangeSuccess = false;
      })

      .addCase(verifyPasswordCodeThunk.pending, (state) => {
        state.verifyCodeLoading = true;
        state.verifyCodeError = null;
        state.verifyCodeSuccess = false;
      })
      .addCase(verifyPasswordCodeThunk.fulfilled, (state) => {
        state.verifyCodeLoading = false;
        state.verifyCodeError = null;
        state.verifyCodeSuccess = true;
      })
      .addCase(verifyPasswordCodeThunk.rejected, (state, action) => {
        state.verifyCodeLoading = false;
        state.verifyCodeError = action.payload as string;
        state.verifyCodeSuccess = false;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Profil güncelleme hatası";
      });
  },
});

export const { clearError, clearPasswordChangeState, setUserFromStorage, clearAuth } = authSlice.actions;
export default authSlice.reducer;