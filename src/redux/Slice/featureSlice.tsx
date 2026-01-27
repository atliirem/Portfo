import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPropertyFeatures } from "../../../api";

interface FeatureOption {
  id: number;
  title: string;
  selected?: boolean;
  childrens?: any[];
}

interface FeatureItem {
  id: number;
  title: string;
  value: any;
  input_type: string;
  details: any;
  options: FeatureOption[];
  childrens?: FeatureItem[];
}

interface FeatureGroup {
  title: string;
  features: FeatureItem[];
}

interface FeatureState {
  detail: {
    propertyId: number | null;
    groups: FeatureGroup[];
    loading: boolean;
  };
  form: {
    propertyId: number | null;
    typeId: number | null;
    groups: FeatureGroup[];
    loading: boolean;
  };
}

const initialState: FeatureState = {
  detail: {
    propertyId: null,
    groups: [],
    loading: false,
  },
  form: {
    propertyId: null,
    typeId: null,
    groups: [],
    loading: false,
  },
};

const featureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    setDetailFeatures: (
      state,
      action: PayloadAction<{ propertyId: number; features: FeatureGroup[] }>
    ) => {
      state.detail.propertyId = action.payload.propertyId;
      state.detail.groups = action.payload.features;
      state.detail.loading = false;
    },

    setFormFeatures: (
      state,
      action: PayloadAction<{
        propertyId?: number;
        typeId?: number;
        features: FeatureGroup[];
      }>
    ) => {
      if (action.payload.propertyId) {
        state.form.propertyId = action.payload.propertyId;
      }
      if (action.payload.typeId) {
        state.form.typeId = action.payload.typeId;
      }
      state.form.groups = action.payload.features;
      state.form.loading = false;
    },

    setDetailLoading: (state, action: PayloadAction<boolean>) => {
      state.detail.loading = action.payload;
    },

    setFormLoading: (state, action: PayloadAction<boolean>) => {
      state.form.loading = action.payload;
    },

    clearFormFeatures: (state) => {
      state.form = initialState.form;
    },

    clearDetailFeatures: (state) => {
      state.detail = initialState.detail;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPropertyFeatures.pending, (state, action) => {
        state.form.loading = true;
        const typeId = action.meta.arg;
        if (typeId) {
          state.form.typeId = typeId;
        }
      })
      .addCase(getPropertyFeatures.fulfilled, (state, action) => {
        state.form.groups = action.payload || [];
        state.form.loading = false;
      })
      .addCase(getPropertyFeatures.rejected, (state) => {
        state.form.loading = false;
        state.form.groups = [];
      });
  },
});

export const {
  setDetailFeatures,
  setFormFeatures,
  setDetailLoading,
  setFormLoading,
  clearFormFeatures,
  clearDetailFeatures,
} = featureSlice.actions;

export default featureSlice.reducer;