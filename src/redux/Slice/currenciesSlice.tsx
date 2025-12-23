import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
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
}

const initialState: CurrencyState = {
  data: [],
  loading: false,
  error: null,
  selectedCurrencyId: null,
};

const currenciesSlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setSelectedCurrency: (state, action: PayloadAction<number>) => {
      state.selectedCurrencyId = action.payload;
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
      .addCase(getCurrencies.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCurrency } = currenciesSlice.actions;
export default currenciesSlice.reducer;
