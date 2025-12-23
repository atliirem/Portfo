// src/redux/slice/citySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCities } from "../../../api/filterThunk";

interface CityState {
  data: any[];
  loading: boolean;
  error: string | null;
  selectedCity: string | null;
}

const initialState: CityState = {
  data: [],
  loading: false,
  error: null,
  selectedCity: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setSelectedCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCities.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCity } = citySlice.actions;
export default citySlice.reducer;


