import { createSlice } from "@reduxjs/toolkit";
import {
  getDiscountedProperties,
  getRecentlyProperties,
  getNews,
  getProperties,
  getNotifications,
  getMyProperties,
  toggleWishlist,
  getWishlist,
  getAllProperties,
} from "../../../api";

interface ImageType {
  id: number;
  path: {
    small: string;
  };
}

interface MapType {
  latitude: string;
  longitude: string;
}

interface Gallery {
  title: string;
  images: ImageType[];
}

interface Property {
  id: number;
  galleries?: Gallery[];
  map?: MapType; 
  [key: string]: any;
}

interface PropertyState {
  favlist: any[];
  alertsList: any[];
  myList: any[];
  discountedList: any[];
  newsList: any[];
  latestList: any[];
  loadingDiscount: boolean;
  loadingNews: boolean;
  loadingLatest: boolean;
  errorDiscount: string | null;
  errorLatest: string | null;
  errorNews: string | null;
  loading: boolean;
  property: Property | null;
}

const initialState: PropertyState = {
  favlist: [],
  alertsList: [],
  myList: [],
  discountedList: [],
  newsList: [],
  latestList: [],
  loadingDiscount: false,
  loadingLatest: false,
  loadingNews: false,
  errorDiscount: null,
  errorLatest: null,
  errorNews: null,
  loading: false,
  property: null,
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   builder
      .addCase(getProperties.pending, (state) => {
        state.loading = true; 
        state.errorNews = null;
        state.property = null; 
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.loading = false;
       
        state.property = action.payload as Property; 
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.loading = false;
        state.errorNews = (action.payload as string) || "İlan detayı alınamadı";
      });
builder
       .addCase(getAllProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.loading = false;

      
        const property = action.payload as Property;
        state.property = property || null;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.errorNews = (action.payload as string) || "Bir hata oluştu";
      });

    builder
      .addCase(getDiscountedProperties.fulfilled, (state, action) => {
        state.discountedList = action.payload;
      })
      .addCase(getRecentlyProperties.fulfilled, (state, action) => {
        state.latestList = action.payload;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.newsList = action.payload;
      })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.myList = action.payload;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.favlist = action.payload;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.alertsList = action.payload.notifications;
      })
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleWishlist.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default propertySlice.reducer;
