import { createSlice } from "@reduxjs/toolkit";
import {
  getAllSubsrictions,
  getAllPackage,
  getActiveSubscriptionUsage,
} from "../../../api";

interface ActiveSubscription {
  is_trial: boolean;
  is_active: boolean;
  package: string;
  finish_at: {
    date: string;
    readable: string;
    text: string;
  };
}

interface UsageItem {
  key: string;
  title: string;
  limit: number;
  used: number;
  can_usage: boolean;
}

interface PackageFeatureGroup {
  title: string;
  features: string[];
}

interface SubscriptionPackage {
  id: number;
  title: string;
  description: string;
  price: string;
  has_trial: boolean;
  trial_version: {
    time: string;
    price: string;
    full: string;
  };
  features: {
    [key: string]: PackageFeatureGroup;
  };
}

interface SubscriptionsState {
  activeSubscriptions: ActiveSubscription[];
  packages: SubscriptionPackage[];

  usage: UsageItem[];
  loadingUsage: boolean;

  loadingActive: boolean;
  loadingPackages: boolean;
  error: string | null;
}

const initialState: SubscriptionsState = {
  activeSubscriptions: [],
  packages: [],

  usage: [],
  loadingUsage: false,

  loadingActive: false,
  loadingPackages: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    resetSubscriptions: () => initialState,
  },
  extraReducers: (builder) => {

    builder
      .addCase(getAllSubsrictions.pending, (state) => {
        state.loadingActive = true;
        state.error = null;
      })
      .addCase(getAllSubsrictions.fulfilled, (state, action) => {
        state.loadingActive = false;
        state.activeSubscriptions = action.payload;
      })
      .addCase(getAllSubsrictions.rejected, (state, action) => {
        state.loadingActive = false;
        state.error = action.payload as string;
      });


    builder
      .addCase(getAllPackage.pending, (state) => {
        state.loadingPackages = true;
      })
      .addCase(getAllPackage.fulfilled, (state, action) => {
        state.loadingPackages = false;
        state.packages = action.payload;
      })
      .addCase(getAllPackage.rejected, (state, action) => {
        state.loadingPackages = false;
        state.error = action.payload as string;
      });


    builder
      .addCase(getActiveSubscriptionUsage.pending, (state) => {
        state.loadingUsage = true;
      })
      .addCase(getActiveSubscriptionUsage.fulfilled, (state, action) => {
        state.loadingUsage = false;
        state.usage = action.payload;
      })
      .addCase(getActiveSubscriptionUsage.rejected, (state, action) => {
        state.loadingUsage = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSubscriptions } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
