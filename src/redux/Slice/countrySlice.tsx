import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCountries } from "../../../api";


interface CountryState {
  data: any[];
  loading: boolean;
  error: string | null;
  selectedCountry: string | null;
}

const initialState: CountryState = {
  data: [],
  loading: false,
  error: null,
  selectedCountry: null,
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
    },
    clearCountry: (state) => {
      state.data = [];
      state.selectedCountry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCountries.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCountry, clearCountry } = countrySlice.actions;
export default countrySlice.reducer;