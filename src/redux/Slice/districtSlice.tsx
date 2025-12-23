
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDistrict } from "../../../api/filterThunk";

interface DistrictState {
  data: any[];
  loading: boolean;
  error: string | null;
  selectedDistrict: string | null;
}

const initialState: DistrictState = {
  data: [],
  loading: false,
  error: null,
  selectedDistrict: null,
};

const DistrictSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    setSelectedDistrict: (state, action: PayloadAction<string | null>) => {
      state.selectedDistrict = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDistrict.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDistrict } = DistrictSlice.actions;
export default DistrictSlice.reducer;
