import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCurrencies } from "../../../api";

interface Currency {
  id: number;
  title: string;
  code: string;
  symbol: string;
}

interface CurrencyState {
  data: Currency[];
  loading: boolean;
  error: string | null;
  selectedCurrencyId: number | null;
  selectedCurrencyCode: string | null; 
}

const initialState: CurrencyState = {
  data: [],
  loading: false,
  error: null,
  selectedCurrencyId: null,
  selectedCurrencyCode: null,
};

const currenciesSlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {

    setSelectedCurrency: (state, action: PayloadAction<number | null>) => {
      state.selectedCurrencyId = action.payload;

      if (action.payload) {
        const currency = state.data.find((c) => c.id === action.payload);
        state.selectedCurrencyCode = currency?.code || null;
      } else {
        state.selectedCurrencyCode = null;
      }
    },

    setSelectedCurrencyCode: (state, action: PayloadAction<string | null>) => {
      state.selectedCurrencyCode = action.payload;

      if (action.payload) {
        const currency = state.data.find((c) => c.code === action.payload);
        state.selectedCurrencyId = currency?.id || null;
      } else {
        state.selectedCurrencyId = null;
      }
    },

    clearSelectedCurrency: (state) => {
      state.selectedCurrencyId = null;
      state.selectedCurrencyCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrencies.fulfilled, (state, action: PayloadAction<Currency[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setSelectedCurrency, 
  setSelectedCurrencyCode, 
  clearSelectedCurrency 
} = currenciesSlice.actions;

export default currenciesSlice.reducer;