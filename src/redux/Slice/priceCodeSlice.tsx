import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PriceState {
  minPrice: string | null;
  maxPrice: string | null;
}

const initialState: PriceState = {
  minPrice: null,
  maxPrice: null,
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    setMinPrice: (state, action: PayloadAction<string | null>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<string | null>) => {
      state.maxPrice = action.payload;
    },
    clearPrice: (state) => {
      state.minPrice = null;
      state.maxPrice = null;
    },
  },
});

export const { setMinPrice, setMaxPrice, clearPrice } = priceSlice.actions;
export default priceSlice.reducer;