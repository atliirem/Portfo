import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  loginThunk, 
  signUpThunk, 
  updateProfile, 
  logoutThunk, 
  changePasswordThunk,
  verifyPasswordCodeThunk 
} from "../../../api";
import { AuthService } from "../../services/AuthService";

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
  company_id?: number;
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
  isInitialized: boolean; 
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
  isInitialized: false,
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
    setUserFromStorage: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.token = action.payload?.token || null;
      state.isInitialized = true; 
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
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
        state.isInitialized = true;
        
        AuthService.setUser(action.payload).catch(err => 
          console.error("AsyncStorage save error:", err)
        );
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
        state.isInitialized = true;
        
        AuthService.setUser(action.payload).catch(err => 
          console.error("AsyncStorage save error:", err)
        );
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
        state.isInitialized = true;
        
        AuthService.logout().catch(err => 
          console.error("AsyncStorage clear error:", err)
        );
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null; 
        state.error = action.payload as string;
        
        AuthService.logout().catch(err => 
          console.error("AsyncStorage clear error:", err)
        );
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
        
        if (action.payload.token) {
          AuthService.setUser(action.payload).catch(err => 
            console.error("AsyncStorage update error:", err)
          );
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Profil güncelleme hatası";
      });
  },
});

export const { clearError, clearPasswordChangeState, setUserFromStorage, clearAuth } = authSlice.actions;
export default authSlice.reducer;