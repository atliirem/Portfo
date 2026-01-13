import { createSlice } from "@reduxjs/toolkit";
import {
  getDeleteProperty,
  getCloneProperty,
  getUpdateSold,
} from "../../../api"

interface PropertyActionsState {
  loading: boolean;
  error: string | null;

  deletedPropertyId: number | null;
  clonedProperty: any | null;
  soldUpdatedPropertyId: number | null;
}

const initialState: PropertyActionsState = {
  loading: false,
  error: null,

  deletedPropertyId: null,
  clonedProperty: null,
  soldUpdatedPropertyId: null,
};

const propertyActionsSlice = createSlice({
  name: "propertyActions",
  initialState,
  reducers: {
    resetPropertyActionsState: (state) => {
      state.loading = false;
      state.error = null;
      state.deletedPropertyId = null;
      state.clonedProperty = null;
      state.soldUpdatedPropertyId = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getDeleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedPropertyId = action.meta.arg; 
      })
      .addCase(getDeleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



builder
  .addCase(getCloneProperty.pending, (state) => {
    state.loading = true;
  })
  .addCase(getCloneProperty.fulfilled, (state, action) => {
    state.loading = false;
    
    const newProperty = action.payload;
    if (newProperty && newProperty.id && typeof newProperty.id === "number") {
      state.myList = [newProperty, ...state.myList];
      state.myListPagination.total += 1;
    }
  })
  .addCase(getCloneProperty.rejected, (state, action) => {
    state.loading = false;
    state.errorMyList = action.payload as string;
  });
      .addCase(getUpdateSold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpdateSold.fulfilled, (state, action) => {
        state.loading = false;
        state.soldUpdatedPropertyId = action.meta.arg;
      })
      .addCase(getUpdateSold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  resetPropertyActionsState,
} = propertyActionsSlice.actions;

export default propertyActionsSlice.reducer;

