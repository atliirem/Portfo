import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  country: string;
  city: string;
  district: string;
  streets: string;
}

interface PriceState {
  currency: string;
  currencyId: number | null;
  minPrice: string;
  maxPrice: string;
}

interface ProjectState {
  roomCount: string;
  min: string;
  max: string;
  priceOptions: string[];
}

interface CommissionState {
  salePrice: string;
  buyerRate: string;
  sellerRate: string;
  currency: string;
  currencyId: number | null;
}

interface PassState {
  salePrice: string;
  passPrice: string;
  currency: string;
  currencyId: number | null;
}

export interface CreateAdState {
  title: string;
  selectedCategory: string;
  selectedCategoryId: number | null;

  selectedSubCategory: string;
  selectedSubCategoryId: number | null;

  location: LocationState;
  price: PriceState;
  project: ProjectState;
  commission: CommissionState;
  pass: PassState;
}

const initialState: CreateAdState = {
  title: "",
  selectedCategory: "",
  selectedCategoryId: null,

  selectedSubCategory: "",
  selectedSubCategoryId: null,

  location: {
    country: "",
    city: "",
    district: "",
    streets: "",
  },

  price: {
    currency: "",
    currencyId: null,
    minPrice: "",
    maxPrice: "",
  },

  pass: {
    salePrice: "",
    passPrice: "",
    currency: "",
    currencyId: null,
  },

  project: {
    roomCount: "",
    min: "",
    max: "",
    priceOptions: [],
  },

  commission: {
    salePrice: "",
    buyerRate: "",
    sellerRate: "",
    currency: "",
    currencyId: null,
  },
};

const createAdSlice = createSlice({
  name: "createAd",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    setCategory: (
      state,
      action: PayloadAction<{ label: string; id: number }>
    ) => {
      state.selectedCategory = action.payload.label;
      state.selectedCategoryId = action.payload.id;

      state.selectedSubCategory = "";
      state.selectedSubCategoryId = null;
    },

    setSubCategory: (
      state,
      action: PayloadAction<{ label: string; id: number }>
    ) => {
      state.selectedSubCategory = action.payload.label;
      state.selectedSubCategoryId = action.payload.id;
    },

    setLocation: (state, action: PayloadAction<Partial<LocationState>>) => {
      state.location = { ...state.location, ...action.payload };
    },

    setPrice: (state, action: PayloadAction<Partial<PriceState>>) => {
      state.price = { ...state.price, ...action.payload };
    },

    setProject: (state, action: PayloadAction<Partial<ProjectState>>) => {
      state.project = { ...state.project, ...action.payload };
    },

    setCommission: (
      state,
      action: PayloadAction<Partial<CommissionState>>
    ) => {
      state.commission = { ...state.commission, ...action.payload };
    },

    setPass: (state, action: PayloadAction<Partial<PassState>>) => {
      state.pass = { ...state.pass, ...action.payload };
    },

    resetCreateAd: () => initialState,
  },
});

export const {
  setTitle,
  setCategory,
  setSubCategory,
  setLocation,
  setPrice,
  setProject,
  setCommission,
  setPass,
  resetCreateAd,
} = createAdSlice.actions;

export default createAdSlice.reducer;