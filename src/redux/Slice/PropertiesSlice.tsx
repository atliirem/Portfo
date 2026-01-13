import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  getDeleteProperty,
  getCloneProperty,
  getUpdateSold,
  updatePropertyStatus,
} from "../../../api";
import { getPropertyById } from "../../../api/CreateThunk";

interface Property {
  id: number;
  title: string;
  status?: string;
  [key: string]: any;
}

interface PaginationState {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  paginationText: string;
}

interface PropertyState {
  favlist: Property[];
  alertsList: any[];
  myList: Property[];
  myListPagination: PaginationState;
  discountedList: Property[];
  newsList: Property[];
  latestList: Property[];
  loadingDiscount: boolean;
  loadingNews: boolean;
  loadingLatest: boolean;
  loadingMyList: boolean;
  errorDiscount: string | null;
  errorLatest: string | null;
  errorNews: string | null;
  errorMyList: string | null;
  loading: boolean;
  error: string | null;
  property: Property | null;
}

const initialState: PropertyState = {
  favlist: [],
  alertsList: [],
  myList: [],
  myListPagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
    paginationText: "",
  },
  discountedList: [],
  newsList: [],
  latestList: [],
  loadingDiscount: false,
  loadingLatest: false,
  loadingNews: false,
  loadingMyList: false,
  errorDiscount: null,
  errorLatest: null,
  errorNews: null,
  errorMyList: null,
  loading: false,
  error: null,
  property: null,
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearMyList: (state) => {
      state.myList = [];
      state.errorMyList = null;
      state.myListPagination = initialState.myListPagination;
    },
    setMyList: (state, action: PayloadAction<Property[]>) => {
      state.myList = action.payload;
    },
    removePropertyFromList: (state, action: PayloadAction<number>) => {
      state.myList = state.myList.filter((item) => item.id !== action.payload);
      state.myListPagination.total = Math.max(0, state.myListPagination.total - 1);
    },
    clearProperty: (state) => {
      state.property = null;
    },
    clearError: (state) => {
      state.error = null;
      state.errorMyList = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(getMyProperties.pending, (state) => {
        state.loadingMyList = true;
        state.errorMyList = null;
      })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.loadingMyList = false;
        state.errorMyList = null;

        const { data, pagination } = action.payload;

        if (Array.isArray(data)) {
          state.myList = [...data];
        }

        state.myListPagination = pagination;
      })
      .addCase(getMyProperties.rejected, (state, action) => {
        state.loadingMyList = false;
        state.errorMyList = action.payload as string;
      });

      


    builder
      .addCase(getProperties.pending, (state) => {
        state.loading = true;
        state.errorNews = null;
        state.property = null;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.loading = false;
        state.errorNews = (action.payload as string) || "İlan detayı alınamadı";
      });

    // ==================== ALL PROPERTIES ====================
    builder
      .addCase(getAllProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload as Property;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.errorNews = (action.payload as string) || "Bir hata oluştu";
      });


    builder
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.property = action.payload;
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
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.favlist = action.payload;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.alertsList = action.payload.notifications;
      });

 
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleWishlist.rejected, (state) => {
        state.loading = false;
      });


    builder
      .addCase(getDeleteProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDeleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;

        state.myList = state.myList.filter((item) => item.id !== deletedId);
        state.myListPagination.total = Math.max(0, state.myListPagination.total - 1);
      })
      .addCase(getDeleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.errorMyList = action.payload as string;
      });


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


    builder
      .addCase(getUpdateSold.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpdateSold.fulfilled, (state, action) => {
        state.loading = false;
        const { id, hold } = action.meta.arg;

        if (hold) {
          state.myList = state.myList.map((item) =>
            item.id === id ? { ...item, status: "sold" } : item
          );
        } else {
          state.myList = state.myList.filter((item) => item.id !== id);
          state.myListPagination.total = Math.max(0, state.myListPagination.total - 1);
        }
      })
      .addCase(getUpdateSold.rejected, (state, action) => {
        state.loading = false;
        state.errorMyList = action.payload as string;
      });

   
    builder
      .addCase(updatePropertyStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePropertyStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;


        state.myList = state.myList.map((item) =>
          item.id === id ? { ...item, status } : item
        );


        if (state.property?.id === id) {
          state.property = { ...state.property, status };
        }
      })
      .addCase(updatePropertyStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearMyList,
  setMyList,
  removePropertyFromList,
  clearProperty,
  clearError,
} = propertySlice.actions;

export default propertySlice.reducer;