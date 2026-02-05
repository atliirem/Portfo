import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loginThunk,
  signUpThunk,
  updateProfile,
  logoutThunk,
  changePasswordThunk,
  verifyPasswordCodeThunk,
} from "../../../api";
import { forgetPasswordThunk, forgetPushNewPasswordThunk } from "../../../api/publicApi";

const AUTH_KEY = "@AUTH";

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
  forgetPasswordLoading: boolean;
  forgetPasswordSuccess: boolean;
  forgetPasswordError: string | null;
  isInitialized: boolean;
  forgetPushLoading: boolean;
  forgetPushSuccess: boolean;
  forgetPushError: string | null;
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
  forgetPasswordLoading: false,
  forgetPasswordSuccess: false,
  forgetPasswordError: null,
  isInitialized: false,
  forgetPushLoading: false,
  forgetPushSuccess: false,
  forgetPushError: null,
};

export const loadAuth = createAsyncThunk("auth/load", async () => {
  try {
    const json = await AsyncStorage.getItem(AUTH_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    await AsyncStorage.removeItem(AUTH_KEY);
    return null;
  }
});

export const clearAuthStorage = createAsyncThunk("auth/clearStorage", async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearForgetPasswordState: (state) => {
      state.forgetPasswordLoading = false;
      state.forgetPasswordSuccess = false;
      state.forgetPasswordError = null;
    },
    clearForgetPushState: (state) => {
      state.forgetPushLoading = false;
      state.forgetPushSuccess = false;
      state.forgetPushError = null;
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
      state.user = action.payload;
      state.token = action.payload.token;
      state.isInitialized = true;

     
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(action.payload));
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAuth.pending, (state) => {
        state.isInitialized = false;
      })
      .addCase(loadAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.token = action.payload.token;
        }
      })
      .addCase(loadAuth.rejected, (state) => {
        state.isInitialized = true;
      })

      .addCase(clearAuthStorage.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isInitialized = true;

        AsyncStorage.setItem(AUTH_KEY, JSON.stringify(action.payload));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isInitialized = true;

        AsyncStorage.setItem(AUTH_KEY, JSON.stringify(action.payload));
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isInitialized = true;

        AsyncStorage.removeItem(AUTH_KEY);
      })

      .addCase(changePasswordThunk.pending, (state) => {
        state.passwordChangeLoading = true;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.passwordChangeLoading = false;
        state.passwordChangeSuccess = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = action.payload as string;
      })

      .addCase(verifyPasswordCodeThunk.pending, (state) => {
        state.verifyCodeLoading = true;
        state.verifyCodeSuccess = false;
      })
      .addCase(verifyPasswordCodeThunk.fulfilled, (state) => {
        state.verifyCodeLoading = false;
        state.verifyCodeSuccess = true;
      })
      .addCase(verifyPasswordCodeThunk.rejected, (state, action) => {
        state.verifyCodeLoading = false;
        state.verifyCodeError = action.payload as string;
      })

      .addCase(forgetPasswordThunk.pending, (state) => {
        state.forgetPasswordLoading = true;
        state.forgetPasswordSuccess = false;
        state.forgetPasswordError = null;
      })
      .addCase(forgetPasswordThunk.fulfilled, (state) => {
        state.forgetPasswordLoading = false;
        state.forgetPasswordSuccess = true;
      })
      .addCase(forgetPasswordThunk.rejected, (state, action) => {
        state.forgetPasswordLoading = false;
        state.forgetPasswordError = action.payload as string;
      })

      .addCase(forgetPushNewPasswordThunk.pending, (state) => {
        state.forgetPushLoading = true;
        state.forgetPushError = null;
        state.forgetPushSuccess = false;
      })
      .addCase(forgetPushNewPasswordThunk.fulfilled, (state) => {
        state.forgetPushLoading = false;
        state.forgetPushSuccess = true;
      })
      .addCase(forgetPushNewPasswordThunk.rejected, (state, action) => {
        state.forgetPushLoading = false;
        state.forgetPushError = action.payload as string;
      })

      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;

        AsyncStorage.setItem(AUTH_KEY, JSON.stringify(action.payload));
      });
  },
});

export const {
  clearForgetPasswordState,
  clearForgetPushState,
  clearPasswordChangeState,
  clearAuth,
  setUserFromStorage, 
} = authSlice.actions;

export default authSlice.reducer;