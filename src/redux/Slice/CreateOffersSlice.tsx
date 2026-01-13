import { createSlice } from "@reduxjs/toolkit";
import { getCreatePriceOffer } from "../../../api";

interface OffersState {
  createOfferData: any | null;
  loadingCreateOffer: boolean;
  errorCreateOffer: string | null;
}

const initialState: OffersState = {
  createOfferData: null,
  loadingCreateOffer: false,
  errorCreateOffer: null,
};

const offersSlice = createSlice({
  name: "Createoffers",
  initialState,
  reducers: {
    resetCreateOffer(state) {
      state.createOfferData = null;
      state.loadingCreateOffer = false;
      state.errorCreateOffer = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getCreatePriceOffer.pending, (state) => {
        state.loadingCreateOffer = true;
        state.errorCreateOffer = null;
      })
      .addCase(getCreatePriceOffer.fulfilled, (state, action) => {
        state.loadingCreateOffer = false;
        state.createOfferData = action.payload;
      })
      .addCase(getCreatePriceOffer.rejected, (state, action) => {
        state.loadingCreateOffer = false;
        state.errorCreateOffer = action.payload as string;
      });
  },
});

export const { resetCreateOffer } = offersSlice.actions;
export default offersSlice.reducer;
