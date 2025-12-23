import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStreet } from "../../../api/filterThunk";

interface PriceState {
  data: any[];
  loading: boolean;
  error: string | null;
  selectedPrice: string | null;
}

const initialState: PriceState = {
  data: [],
  loading: false,
  error: null,
  selectedPrice: null,
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    setSelectedPrice: (state, action: PayloadAction<string | null>) => {
      state.selectedPrice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStreet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStreet.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStreet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStreet } = streetsSlice.actions;
export default streetsSlice.reducer;