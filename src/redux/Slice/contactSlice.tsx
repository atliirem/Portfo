import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { getContact } from "../../../api";


export interface Contact {
  phone: string;
  email: string;
  address: string;
  socials: {
    linkedin: string;
    x: string;
    facebook: string;
    instagram: string;
  };
}

export interface ContactState {
  contact: Contact | null;
  loading: boolean;
  error: string | null;
}


const initialState: ContactState = {
  contact: null,
  loading: false,
  error: null,
};



const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        state.loading = false;
        state.contact = {
          ...action.payload,
          phone: action.payload.phone.trim(), 
        };
      })
      .addCase(getContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "İletişim bilgileri alınamadı";
      });
  },
});

export default contactSlice.reducer;