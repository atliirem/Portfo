import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  country: string;
  countryName: string;
  city: string;
  cityName: string;
  district: string;
  districtName: string;
  streets: string;
  streetsName: string;
  address: string;
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

export interface ExtraFeaturesState {
  [featureId: number]: any;
}

export interface LicenceFileState {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface CreateAdState {
  propertyId: number | null;
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
  extraFeatures: ExtraFeaturesState;
  licenceFile: LicenceFileState | null;
  isEditMode: boolean;
}

const initialState: CreateAdState = {
  propertyId: null,
  title: "",
  selectedCategory: "",
  selectedCategoryId: null,
  selectedSubCategory: "",
  selectedSubCategoryId: null,
  location: {
    country: "",
    countryName: "",
    city: "",
    cityName: "",
    district: "",
    districtName: "",
    streets: "",
    streetsName: "",
    address: "",
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
  extraFeatures: {},
  licenceFile: null,
  isEditMode: false,
};

const createAdSlice = createSlice({
  name: "createAd",
  initialState,
  reducers: {
    setPropertyId: (state, action: PayloadAction<number | null>) => {
      state.propertyId = action.payload;
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    setCategory: (state, action: PayloadAction<{ label: string; id: number }>) => {
      state.selectedCategory = action.payload.label;
      state.selectedCategoryId = action.payload.id;
      state.selectedSubCategory = "";
      state.selectedSubCategoryId = null;
    },

    setSubCategory: (state, action: PayloadAction<{ label: string; id: number }>) => {
      state.selectedSubCategory = action.payload.label;
      state.selectedSubCategoryId = action.payload.id;
    },

    setLocation: (state, action: PayloadAction<Partial<LocationState>>) => {
      state.location = { ...state.location, ...action.payload };
    },

    setPrice: (state, action: PayloadAction<Partial<PriceState>>) => {
      state.price = { ...state.price, ...action.payload };
    },

    setPass: (state, action: PayloadAction<Partial<PassState>>) => {
      state.pass = { ...state.pass, ...action.payload };
    },

    setCommission: (state, action: PayloadAction<Partial<CommissionState>>) => {
      state.commission = { ...state.commission, ...action.payload };
    },

    setProject: (state, action: PayloadAction<Partial<ProjectState>>) => {
      state.project = { ...state.project, ...action.payload };
    },

    // Fiyat seçenekleri
    addPriceOption: (state, action: PayloadAction<string>) => {
      state.project.priceOptions.push(action.payload);
    },

    updatePriceOption: (state, action: PayloadAction<{ index: number; value: string }>) => {
      const { index, value } = action.payload;
      if (index >= 0 && index < state.project.priceOptions.length) {
        state.project.priceOptions[index] = value;
      }
    },

    removePriceOption: (state, action: PayloadAction<number>) => {
      state.project.priceOptions.splice(action.payload, 1);
    },

    // Extra özellikler
    setExtraFeature: (state, action: PayloadAction<{ id: number; value: any }>) => {
      state.extraFeatures[action.payload.id] = action.payload.value;
    },

    clearExtraFeatures: (state) => {
      state.extraFeatures = {};
    },

    // Yetki belgesi
    setLicenceFile: (state, action: PayloadAction<LicenceFileState | null>) => {
      state.licenceFile = action.payload;
    },

    // Mülk verilerini forma yükle (düzenleme modu)
    loadPropertyToForm: (state, action: PayloadAction<any>) => {
      const property = action.payload;

      state.propertyId = property.id;
      state.title = property.title || "";
      state.isEditMode = true;

      if (property.type) {
        state.selectedCategory = property.type.title || "";
        state.selectedCategoryId = property.type.id || null;
      }

      state.location = {
        country: property.country?.id?.toString() || "",
        countryName: property.country?.title || "",
        city: property.city?.id?.toString() || "",
        cityName: property.city?.title || "",
        district: property.district?.id?.toString() || "",
        districtName: property.district?.title || "",
        streets: property.street?.id?.toString() || "",
        streetsName: property.street?.title || "",
        address: property.address || "",
      };

      const sellPrice =
        property.sell_price?.toString() ||
        property.prices?.primary?.number?.toString() ||
        property.price?.number?.toString() ||
        "";

      const passPrice =
        property.pass_price?.toString() ||
        property.prices?.secondary?.number?.toString() ||
        "";

      const currencyTitle =
        property.currency?.title ||
        property.price?.code ||
        "";

      const currencyId = property.currency?.id || null;

      state.pass = {
        salePrice: sellPrice,
        passPrice: passPrice,
        currency: currencyTitle,
        currencyId: currencyId,
      };

      state.price.currency = currencyTitle;
      state.price.currencyId = currencyId;

      // Yetki belgesi
      if (property.project_licence_file) {
        state.licenceFile = {
          uri: property.project_licence_file,
          name: "Yetki Belgesi",
          type: "application/pdf",
        };
      }

      // Extra özellikler
      if (property.features && Array.isArray(property.features)) {
        const extras: Record<number, any> = {};

        property.features.forEach((group: any) => {
          if (group.features && Array.isArray(group.features)) {
            group.features.forEach((feature: any) => {
              const hasValue =
                feature.value !== null &&
                feature.value !== "" &&
                feature.value !== undefined;

              if (hasValue) {
                if (feature.input_type === "select" && feature.options) {
                  const selectedOption = feature.options.find((opt: any) => opt.selected);
                  if (selectedOption) {
                    extras[feature.id] = selectedOption;
                  }
                } else {
                  extras[feature.id] = feature.value;
                }
              }
            });
          }
        });

        state.extraFeatures = extras;
      }
    },

    // Formu sıfırla
    resetCreateAd: () => initialState,
  },
});

export const {
  setPropertyId,
  setTitle,
  setCategory,
  setSubCategory,
  setLocation,
  setPrice,
  setPass,
  setCommission,
  setProject,
  addPriceOption,
  updatePriceOption,
  removePriceOption,
  setExtraFeature,
  clearExtraFeatures,
  setLicenceFile,
  loadPropertyToForm,
  resetCreateAd,
} = createAdSlice.actions;

export default createAdSlice.reducer;