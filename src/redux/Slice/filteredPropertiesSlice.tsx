import { createSlice } from "@reduxjs/toolkit";
import { getFilteredProperties } from "../../../api";

interface PaginationState {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}

interface FilteredPropertiesState {
  data: any[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

const initialState: FilteredPropertiesState = {
  data: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },
};

const filteredPropertiesSlice = createSlice({
  name: "filteredProperties",
  initialState,
  reducers: {
    resetFilteredProperties: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilteredProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilteredProperties.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Her sayfa değişiminde yeni veri göster (append değil, replace)
        state.data = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        
        // DEBUG
        console.log("✅ Slice Updated:");
        console.log("  - Data count:", state.data.length);
        console.log("  - Pagination:", state.pagination);
      })
      .addCase(getFilteredProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Bir hata oluştu";
        console.log("❌ Slice Error:", state.error);
      });
  },
});

export const { resetFilteredProperties } = filteredPropertiesSlice.actions;
export default filteredPropertiesSlice.reducer;