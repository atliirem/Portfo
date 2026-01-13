import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteCustomer,
  getAllCompanies,
  getCompany,
  getCustomers,
  getReceivedOffers,
  getSummary,
  getTeam,
  updateCustomer,
  getCompanyTeam,
  getCompanyProperties,
  getCompanyTeamById,
  getCompanyLocations,
} from "../../../api";

interface Personal {
  id: number;
  is_active: boolean;
  avatar: string;
  name: string;
  locale: string;
  roles: { id: number; title: string; key: string }[];
  contacts_can_visible: boolean;
  contacts: {
    phone: { code: string; number: string | null };
    email: string;
    whatsapp: string;
  };
}

interface Customer {
  id: number;
  is_active: boolean;
  avatar: string;
  name: string;
  locale: string;
  roles: { id: number; title: string; key: string }[];
  contacts_can_visible: boolean;
  contacts: {
    phone: { code: string; number: string | null };
    email: string;
    whatsapp: string;
  };
}

interface LocationItem {
  id: number | null;
  title: string | null;
  lat: number | null;
  lng: number | null;
}

interface Location {
  id: number;
  address: string;
  country: LocationItem;
  city: LocationItem;
  district: LocationItem;
  street: LocationItem;
  map: {
    latitude: number | null;
    longitude: number | null;
  };
}

interface Company {
  id: number;
  name: string;
  creator?: string;
  logo: string;
  type: string;
  code: string;
  score?: number;
  updated_at?: string;
  created_at: string;
  website?: string;
  email?: string;
  phone?: string;
  summary?: { counts: any[] };
  properties?: any[];
  personals?: Personal[];
  customers?: Customer[];
  badges?: { title: string; icon: string }[];
  locations?: Location[];
}

interface Offer {
  id: number;
  name: string;
  logo: string;
  type: string;
  code: string;
  created_at: string;
  score?: number;
  summary: { counts: any[] };
  properties: any[];
}

interface PaginationState {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  paginationText: string;
}

export interface CompanyState {
  company: Company | null;
  selectedCompany: Company | null;
  companies: Company[];

  offers: Offer[];
  personals: Personal[];
  customers: Customer[];

  selectedCompanyTeam: Personal[];
  loadingTeam: boolean;
  errorTeam: string | null;

  companyProperties: any[];
  companyPropertiesPagination: PaginationState | null;
  loadingProperties: boolean;
  errorProperties: string | null;

  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  selectedCompany: null,
  companies: [],

  offers: [],
  personals: [],
  customers: [],

  selectedCompanyTeam: [],
  loadingTeam: false,
  errorTeam: null,

  companyProperties: [],
  companyPropertiesPagination: null,
  loadingProperties: false,
  errorProperties: null,

  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyProperties: (state) => {
      state.companyProperties = [];
      state.companyPropertiesPagination = null;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
      state.companyProperties = [];
      state.companyPropertiesPagination = null;
      state.selectedCompanyTeam = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.company = action.payload;
        state.personals = action.payload.personals || [];
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Şirket bilgisi alınamadı.";
      })


      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Şirket listesi alınamadı.";
      })


      .addCase(getCompanyProperties.pending, (state) => {
        state.loadingProperties = true;
        state.errorProperties = null;
      })
      .addCase(getCompanyProperties.fulfilled, (state, action) => {
        state.loadingProperties = false;
        state.companyProperties = action.payload.data || [];
        state.companyPropertiesPagination = action.payload.pagination || null;
        if (action.payload.companyInfo) {
          state.selectedCompany = action.payload.companyInfo;
        }
      })
      .addCase(getCompanyProperties.rejected, (state, action) => {
        state.loadingProperties = false;
        state.errorProperties = action.payload as string;
      })

      /* ===== COMPANY TEAM BY ID (Diğer firmaların ekibi) ===== */
      .addCase(getCompanyTeamById.pending, (state) => {
        state.loadingTeam = true;
        state.errorTeam = null;
      })
      .addCase(getCompanyTeamById.fulfilled, (state, action) => {
        state.loadingTeam = false;
        state.selectedCompanyTeam = action.payload?.personals || [];
        if (action.payload?.id) {
          state.selectedCompany = {
            ...state.selectedCompany,
            id: action.payload.id,
            name: action.payload.name,
            logo: action.payload.logo,
            type: action.payload.type,
            code: action.payload.code,
            score: action.payload.score,
            created_at: action.payload.created_at,
            badges: action.payload.badges,
            locations: action.payload.locations,
          };
        }
      })
      .addCase(getCompanyTeamById.rejected, (state, action) => {
        state.loadingTeam = false;
        state.errorTeam = action.payload as string;
      })


      .addCase(getReceivedOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedOffers.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(getReceivedOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Teklif bilgisi alınamadı.";
      })


      .addCase(getTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.personals = action.payload;
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(getCompanyTeam.fulfilled, (state, action) => {
        const personals = action.payload?.personals;
        state.personals = Array.isArray(personals) ? personals : [];
      })

      /* ===== CUSTOMERS ===== */
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customers = action.payload?.data || action.payload || [];
      })

      /* ===== DELETE CUSTOMER ===== */
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.customers = state.customers.filter((c) => c.id !== deletedId);
      })

      /* ===== UPDATE CUSTOMER ===== */
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.customers = state.customers.map((c) =>
          c.id === id ? { ...c, ...data } : c
        );
      })
      .addCase(getCompanyLocations.pending, (state) => {
  state.loading = true;
})
.addCase(getCompanyLocations.fulfilled, (state, action) => {
  state.loading = false;
  if (state.selectedCompany) {
    state.selectedCompany.locations = action.payload?.locations || action.payload || [];
  }
})
.addCase(getCompanyLocations.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})

      /* ===== SUMMARY ===== */
      .addCase(getSummary.fulfilled, (state, action) => {
        if (state.company) {
          state.company.summary = action.payload.summary;
        }
      });
  },
});

export const { clearCompanyProperties, clearSelectedCompany } = companySlice.actions;
export default companySlice.reducer;