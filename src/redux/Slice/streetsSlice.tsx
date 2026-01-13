import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStreet } from "../../../api";

interface StreetsState {
  data: any[];
  loading: boolean;
  error: string | null;
  selectedStreet: string | null;
}

const initialState: StreetsState = {
  data: [],
  loading: false,
  error: null,
  selectedStreet: null,
};

const streetsSlice = createSlice({
  name: "streets",
  initialState,
  reducers: {
    setSelectedStreet: (state, action: PayloadAction<string | null>) => {
      state.selectedStreet = action.payload;
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