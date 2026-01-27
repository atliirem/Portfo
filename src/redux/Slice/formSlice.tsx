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

interface MapCoordinatesState {
  latitude: number | null;
  longitude: number | null;
  isSet: boolean;
}

interface GalleryStatusState {
  hasCoverImage: boolean;
  totalImages: number;
  isValid: boolean;
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
  mapCoordinates: MapCoordinatesState;
  galleryStatus: GalleryStatusState;
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
  mapCoordinates: {
    latitude: null,
    longitude: null,
    isSet: false,
  },
  galleryStatus: {
    hasCoverImage: false,
    totalImages: 0,
    isValid: false,
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

    setMapCoordinates: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.mapCoordinates = {
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        isSet: true,
      };
    },

    clearMapCoordinates: (state) => {
      state.mapCoordinates = initialState.mapCoordinates;
    },

    setGalleryStatus: (state, action: PayloadAction<{ hasCoverImage?: boolean; totalImages?: number }>) => {
      if (action.payload.hasCoverImage !== undefined) {
        state.galleryStatus.hasCoverImage = action.payload.hasCoverImage;
      }
      if (action.payload.totalImages !== undefined) {
        state.galleryStatus.totalImages = action.payload.totalImages;
      }
      state.galleryStatus.isValid = 
        state.galleryStatus.hasCoverImage || state.galleryStatus.totalImages > 0;
    },

    clearGalleryStatus: (state) => {
      state.galleryStatus = initialState.galleryStatus;
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

    setExtraFeature: (state, action: PayloadAction<{ id: number; value: any }>) => {
      state.extraFeatures[action.payload.id] = action.payload.value;
    },

    clearExtraFeatures: (state) => {
      state.extraFeatures = {};
    },

    setLicenceFile: (state, action: PayloadAction<LicenceFileState | null>) => {
      state.licenceFile = action.payload;
    },

    loadPropertyToForm: (state, action: PayloadAction<any>) => {
      const property = action.payload;

      state.propertyId = property.id;
      state.title = property.title || "";
      state.isEditMode = true;

      if (property.type) {
        state.selectedCategory = property.type.title || "";
        state.selectedCategoryId = property.type.id || null;

        if (property.type.parent) {
          state.selectedSubCategory = property.type.title || "";
          state.selectedSubCategoryId = property.type.id || null;
        }
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

      if (property.latitude && property.longitude) {
        state.mapCoordinates = {
          latitude: parseFloat(property.latitude),
          longitude: parseFloat(property.longitude),
          isSet: true,
        };
      }

      if (property.cover || (property.galleries && property.galleries.length > 0)) {
        const totalImages = property.galleries?.reduce(
          (sum: number, cat: any) => sum + (cat.images?.length || 0), 0
        ) || 0;
        
        state.galleryStatus = {
          hasCoverImage: !!property.cover,
          totalImages: totalImages,
          isValid: !!property.cover || totalImages > 0,
        };
      }

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
      state.commission.currency = currencyTitle;
      state.commission.currencyId = currencyId;

      if (property.project_licence_file) {
        state.licenceFile = {
          uri: property.project_licence_file,
          name: "Yetki Belgesi",
          type: "application/pdf",
        };
      }

      if (property.features && Array.isArray(property.features)) {
        const extras: Record<number, any> = {};

        property.features.forEach((group: any) => {
          if (group.features && Array.isArray(group.features)) {
            group.features.forEach((feature: any) => {
              const hasValue =
                feature.value !== null &&
                feature.value !== "" &&
                feature.value !== undefined &&
                !(Array.isArray(feature.value) && feature.value.length === 0);

              if (hasValue) {
                if (feature.input_type === "select" && feature.options) {
                  if (feature.details?.multiple || feature.details?.multiple === "1") {
                    const selectedOptions = feature.options.filter((opt: any) => opt.selected);
                    if (selectedOptions.length > 0) {
                      extras[feature.id] = selectedOptions;
                    }
                  } else {
                    const selectedOption = feature.options.find((opt: any) => opt.selected);
                    if (selectedOption) {
                      extras[feature.id] = selectedOption;
                    }
                  }
                } else if (
                  feature.input_type === "number" &&
                  (feature.details?.is_range === "1" || feature.details?.range_on_project === "1")
                ) {
                  if (typeof feature.value === "object") {
                    extras[feature.id] = {
                      min: String(feature.value.min || ""),
                      max: String(feature.value.max || ""),
                    };
                  } else {
                    extras[feature.id] = feature.value;
                  }
                } else if (feature.input_type === "file") {
                  if (Array.isArray(feature.value) && feature.value.length > 0) {
                    const file = feature.value[0];
                    extras[feature.id] = {
                      uri: file.path || file.uri || "",
                      name: file.name || "Dosya",
                      type: file.mimetype || file.type || "application/octet-stream",
                      size: file.size,
                    };
                  } else if (typeof feature.value === "object" && feature.value.path) {
                    extras[feature.id] = {
                      uri: feature.value.path,
                      name: feature.value.name || "Dosya",
                      type: feature.value.mimetype || "application/octet-stream",
                      size: feature.value.size,
                    };
                  } else if (typeof feature.value === "string") {
                    extras[feature.id] = {
                      uri: feature.value,
                      name: "Dosya",
                      type: "application/octet-stream",
                    };
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

    resetCreateAd: () => initialState,
  },
});

export const {
  setPropertyId,
  setTitle,
  setCategory,
  setSubCategory,
  setLocation,
  setMapCoordinates,
  clearMapCoordinates,
  setGalleryStatus,
  clearGalleryStatus,
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