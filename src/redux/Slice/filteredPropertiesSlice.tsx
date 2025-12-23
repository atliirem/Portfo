
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getFilteredProperties} from "../../../api"
interface FilteredPropertiesState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FilteredPropertiesState = {
  data: [],
  loading: false,
  error: null,
};


const filteredPropertiesSlice = createSlice({
  name: 'filteredProperties',
  initialState,
  reducers: {
    
    resetFilteredProperties: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilteredProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilteredProperties.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(getFilteredProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Bir hata oluştu';
      });
  },
});

export const { resetFilteredProperties } = filteredPropertiesSlice.actions;
export default filteredPropertiesSlice.reducer;
