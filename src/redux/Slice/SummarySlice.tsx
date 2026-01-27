import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSummary } from "../../../api";

interface CountItem {
  title: string;
  value: number | string;
}

interface GraphTypeItem {
  name: string;
  data: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface ReviewGraph {
  labels: string[];
  datasets: {
    data: number[];
  };
}

interface VisitsGraph {
  labels: string[];
  datasets: {
    data: number[];
  };
}

interface Graphs {
  types: GraphTypeItem[];
  review: ReviewGraph;
  visits: VisitsGraph;
}

interface PropertyItem {
  id: number;
  no: string;
  creator: string;
  status: {
    key: string;
    title: string;
  };
  title: string;
  type: string;
  location: string;
  price: string;
  views: number;
  favorites: number;
  proposals: number;
  score: {
    total: number;
    avg: number;
  };
  created_at: string;
  updated_at: string;
}

interface Badge {
  title: string;
  icon: string;
}

interface SummaryData {
  counts: CountItem[];
  graphs: Graphs;
  properties: PropertyItem[];
}

interface CompanyInfo {
  id: number;
  name: string;
  logo: string;
  code: string;
  type: string;
  score: number;
  created_at: string;
  badges: Badge[];
}

interface SummaryState {
  companyInfo: CompanyInfo | null;
  summaryData: SummaryData | null;
  loading: boolean;
  error: string | null;
}



const initialState: SummaryState = {
  companyInfo: null,
  summaryData: null,
  loading: false,
  error: null,
};


const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    clearSummary: (state) => {
      state.companyInfo = null;
      state.summaryData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSummary.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;

        const data = action.payload;


        state.companyInfo = {
          id: data.id,
          name: data.name,
          logo: data.logo,
          code: data.code,
          type: data.type,
          score: data.score,
          created_at: data.created_at,
          badges: data.badges || [],
        };

 
        state.summaryData = {
          counts: data.summary?.counts || [],
          graphs: data.summary?.graphs || {
            types: [],
            review: { labels: [], datasets: { data: [] } },
            visits: { labels: [], datasets: { data: [] } },
          },
          properties: data.summary?.properties || [],
        };
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSummary } = summarySlice.actions;
export default summarySlice.reducer;