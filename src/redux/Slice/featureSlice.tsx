import { createSlice } from "@reduxjs/toolkit";
import { getPropertyFeatures } from "../../../api";

interface FeatureItem {
  id: number;
  title: string;
  value: any;
  input_type: string;
  details: any;
  options: any[];
  childrens?: FeatureItem[];
}

interface FeatureGroup {
  title: string;
  features: FeatureItem[];
}

interface FeatureState {
  titles: string[];
  groups: FeatureGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  titles: [],
  groups: [],
  loading: false,
  error: null,
};

const featureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPropertyFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.titles = [];
        state.groups = [];
      })
      .addCase(getPropertyFeatures.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        if (!Array.isArray(data)) {
          state.titles = [];
          state.groups = [];
          return;
        }

        state.titles = data.map((group: any) => group.title);


        state.groups = data.map((group: any) => ({
          title: group.title,
          features: group.features || [],
        }));
      })
      .addCase(getPropertyFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Hata oluştu";
      });
  },
});

export default featureSlice.reducer;
