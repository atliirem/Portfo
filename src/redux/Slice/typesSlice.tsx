import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTypes } from "../../../api";

export interface FeatureOption {
  id: number;
  title: string;
}

export interface FeatureDetails {
  min?: string | null;
  max?: string | null;
  is_range?: string;
  is_hidden?: string;
  hide_on_proposal?: string;
  multiple?: string;
  multiple_on_filter?: string;
  required?: string;
  fraction?: string;
  range_on_project?: string;
}

export interface Feature {
  id: number;
  title: string;
  type: string;
  details: FeatureDetails;
  options: FeatureOption[] | null;
}

export interface Category {
  id: number;
  title: string;
  childrens?: Category[];
  presetFeatures?: Feature[];
}

interface TypeTitle {
  id: number;
  label: string;
  parent?: string;
  features?: Feature[];
}

interface TypeState {
  data: Category[];
  titles: TypeTitle[];
  features: Feature[];
  loading: boolean;
  error: string | null;
  selectedTypes: number[]; // ✅ string[] → number[]
}

const initialState: TypeState = {
  data: [],
  titles: [],
  features: [],
  loading: false,
  error: null,
  selectedTypes: [],
};

const extractTitles = (
  categories: Category[],
  parent?: string
): TypeTitle[] => {
  let titles: TypeTitle[] = [];

  categories.forEach((item) => {
    titles.push({
      id: item.id,
      label: item.title,
      parent,
      features: item.presetFeatures || [],
    });

    if (item.childrens?.length) {
      titles = titles.concat(extractTitles(item.childrens, item.title));
    }
  });

  return titles;
};

const extractFeatures = (categories: Category[]): Feature[] => {
  let list: Feature[] = [];

  categories.forEach((item) => {
    if (item.presetFeatures?.length) {
      list = list.concat(item.presetFeatures);
    }

    if (item.childrens?.length) {
      list = list.concat(extractFeatures(item.childrens));
    }
  });

  return list;
};

const typesSlice = createSlice({
  name: "types",
  initialState,
  reducers: {
    // ✅ number[] olarak güncellendi
    setSelectedTypes: (state, action: PayloadAction<number[]>) => {
      state.selectedTypes = action.payload;
    },
    clearSelectedTypes: (state) => {
      state.selectedTypes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTypes.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.titles = extractTitles(action.payload);
        state.features = extractFeatures(action.payload);
      })
      .addCase(getTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTypes, clearSelectedTypes } = typesSlice.actions;
export default typesSlice.reducer;