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
  updateCompanyProfileThunk,
  uploadCompanyLogoThunk,
  createCustomerThunk,
  createInvitationThunk,
  getInvitationsThunk,
  deleteInvitationThunk,
  updateInvitationThunk,
  updatePersonalProfileThunk,
  updatePersonalStatusThunk,
  getPersonalPermissionsThunk,
  updatePersonalPermissionsThunk,
  getRolesThunk,
} from "../../../api";

interface Personal {
  id: number;
  is_active: boolean;
  avatar: string;
  name: string;
  locale: string;
  roles?: { id: number; title: string; company_id?: number }[];
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

interface Role {
  key: string;
  title: string;
}

interface Invitation {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: {
    code: string;
    number: string;
  };
  role: {
    key: string;
    title: string;
  };
  locale: {
    key: string;
    title: string;
  };
  status: "waiting" | "completed" | "expired";
  created_by: string;
  created_at: string;
  expiry_at: string;
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

interface CompanySummary {
  counts: any[];
  graphs?: Graphs;
  properties?: any[];
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
  summary?: CompanySummary;
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

  personalPermissions: any[];
  personalPermissionsLoading: boolean;
  personalPermissionsError: string | null;
  updatePermissionsLoading: boolean;
  updateStatusLoading: boolean;

  createCustomerLoading: boolean;
  createCustomerError: string | null;

  invitations: Invitation[];
  invitationsLoading: boolean;
  invitationsError: string | null;
  createInvitationLoading: boolean;
  createInvitationError: string | null;
  deleteInvitationLoading: boolean;
  updateInvitationLoading: boolean;
  updateInvitationError: string | null;

  roles: Role[];
  rolesLoading: boolean;
  rolesError: string | null;

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

  loadingSummary: boolean;
  errorSummary: string | null;

  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  selectedCompany: null,
  companies: [],
  personalPermissions: [],
  personalPermissionsLoading: false,
  personalPermissionsError: null,
  updatePermissionsLoading: false,
  updateStatusLoading: false,

  createCustomerLoading: false,
  createCustomerError: null,

  invitations: [],
  invitationsLoading: false,
  invitationsError: null,
  createInvitationLoading: false,
  createInvitationError: null,
  deleteInvitationLoading: false,
  updateInvitationLoading: false,
  updateInvitationError: null,

  roles: [],
  rolesLoading: false,
  rolesError: null,

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

  loadingSummary: false,
  errorSummary: null,

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
    clearSummary: (state) => {
      if (state.company) {
        state.company.summary = undefined;
      }
      state.errorSummary = null;
    },
    clearInvitationError: (state) => {
      state.createInvitationError = null;
      state.updateInvitationError = null;
    },
    clearInvitations: (state) => {
      state.invitations = [];
      state.invitationsError = null;
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

      .addCase(updateCompanyProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyProfileThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
        const updated = action.payload;
        if (state.company?.id && updated?.id && state.company.id === updated.id) {
          state.company = { ...state.company, ...updated };
        } else if (!state.company) {
          state.company = updated;
        }
        if (state.selectedCompany?.id && updated?.id && state.selectedCompany.id === updated.id) {
          state.selectedCompany = { ...state.selectedCompany, ...updated };
        }
        if (Array.isArray(state.companies) && updated?.id) {
          state.companies = state.companies.map((c) =>
            c.id === updated.id ? { ...c, ...updated } : c
          );
        }
      })
      .addCase(updateCompanyProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Firma güncellenemedi";
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

      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload ?? [];
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCustomer.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.customers = state.customers.filter((c) => c.id !== deletedId);
      })

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

      .addCase(uploadCompanyLogoThunk.fulfilled, (state, action) => {
        if (state.company) {
          state.company.logo = action.payload.path;
        }
      })

      .addCase(createCustomerThunk.pending, (state) => {
        state.createCustomerLoading = true;
        state.createCustomerError = null;
      })
      .addCase(createCustomerThunk.rejected, (state, action) => {
        state.createCustomerLoading = false;
        state.createCustomerError =
          (action.payload as string) || action.error.message || "Müşteri oluşturulamadı";
      })
      .addCase(createCustomerThunk.fulfilled, (state, action) => {
        state.createCustomerLoading = false;
        state.createCustomerError = null;

        const payload = action.meta.arg;
        const tempId = Date.now();

        const mappedCustomer = {
          id: tempId,
          name: payload.name,
          email: payload.email ?? "",
          phone: {
            code: payload.phone_code ?? "90",
            number: payload.phone ?? null,
          },
          locale: {
            title: "Türkçe",
            key: payload.locale ?? "tr",
          },
          created_at: new Date().toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          creator: "",
          proposals: 0,
        };

        state.customers.unshift(mappedCustomer);
      })

      .addCase(getInvitationsThunk.pending, (state) => {
        state.invitationsLoading = true;
        state.invitationsError = null;
      })
      .addCase(getInvitationsThunk.fulfilled, (state, action) => {
        state.invitationsLoading = false;
        state.invitations = action.payload;
      })
      .addCase(getInvitationsThunk.rejected, (state, action) => {
        state.invitationsLoading = false;
        state.invitationsError = action.payload as string;
      })

      .addCase(createInvitationThunk.pending, (state) => {
        state.createInvitationLoading = true;
        state.createInvitationError = null;
      })
      .addCase(createInvitationThunk.fulfilled, (state, action) => {
        state.createInvitationLoading = false;
        state.createInvitationError = null;
      })
      .addCase(createInvitationThunk.rejected, (state, action) => {
        state.createInvitationLoading = false;
        state.createInvitationError =
          (action.payload as string) || "Davetiye oluşturulamadı";
      })

      .addCase(deleteInvitationThunk.pending, (state) => {
        state.deleteInvitationLoading = true;
      })
      .addCase(deleteInvitationThunk.fulfilled, (state, action) => {
        state.deleteInvitationLoading = false;
        const { invitationId } = action.payload;
        state.invitations = state.invitations.filter((inv) => inv.id !== invitationId);
      })
      .addCase(deleteInvitationThunk.rejected, (state) => {
        state.deleteInvitationLoading = false;
      })

      .addCase(getPersonalPermissionsThunk.pending, (state) => {
        state.personalPermissionsLoading = true;
        state.personalPermissionsError = null;
      })
      .addCase(getPersonalPermissionsThunk.fulfilled, (state, action) => {
        state.personalPermissionsLoading = false;
        state.personalPermissions = action.payload;
      })
      .addCase(getPersonalPermissionsThunk.rejected, (state, action) => {
        state.personalPermissionsLoading = false;
        state.personalPermissionsError = action.payload as string;
      })

      .addCase(updatePersonalPermissionsThunk.pending, (state) => {
        state.updatePermissionsLoading = true;
      })
      .addCase(updatePersonalPermissionsThunk.fulfilled, (state) => {
        state.updatePermissionsLoading = false;
      })
      .addCase(updatePersonalPermissionsThunk.rejected, (state) => {
        state.updatePermissionsLoading = false;
      })

      .addCase(updatePersonalStatusThunk.pending, (state) => {
        state.updateStatusLoading = true;
      })
      .addCase(updatePersonalStatusThunk.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        const { personalId, is_active } = action.payload;
        state.personals = state.personals.map((p) =>
          p.id === personalId ? { ...p, is_active } : p
        );
      })
      .addCase(updatePersonalStatusThunk.rejected, (state) => {
        state.updateStatusLoading = false;
      })

      .addCase(updatePersonalProfileThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePersonalProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { personalId, data } = action.payload;
        if (data) {
          state.personals = state.personals.map((p) =>
            p.id === personalId ? { ...p, ...data } : p
          );
        }
      })
      .addCase(updatePersonalProfileThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(updateInvitationThunk.pending, (state) => {
        state.updateInvitationLoading = true;
        state.updateInvitationError = null;
      })
      .addCase(updateInvitationThunk.fulfilled, (state, action) => {
        state.updateInvitationLoading = false;
        state.updateInvitationError = null;
        const { invitationId, data } = action.payload;
        state.invitations = state.invitations.map((inv) =>
          inv.id === invitationId
            ? {
                ...inv,
                name: data.name || inv.name,
                email: data.email || inv.email,
                phone: {
                  code: data.phone_code || inv.phone.code,
                  number: data.phone || inv.phone.number,
                },
                role: {
                  ...inv.role,
                  key: data.role || inv.role.key,
                },
                locale: {
                  ...inv.locale,
                  key: data.locale || inv.locale.key,
                },
              }
            : inv
        );
      })
      .addCase(updateInvitationThunk.rejected, (state, action) => {
        state.updateInvitationLoading = false;
        state.updateInvitationError =
          (action.payload as string) || "Davetiye güncellenemedi";
      })

      .addCase(getRolesThunk.pending, (state) => {
        console.log("getRolesThunk.pending - Redux state güncelleniyor");
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(getRolesThunk.fulfilled, (state, action) => {
        console.log("getRolesThunk.fulfilled - Roller Redux'a kaydediliyor:", action.payload);
        state.rolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(getRolesThunk.rejected, (state, action) => {
        console.log("getRolesThunk.rejected - Hata:", action.payload);
        state.rolesLoading = false;
        state.rolesError = action.payload as string;
      })

      .addCase(getSummary.pending, (state) => {
        state.loadingSummary = true;
        state.errorSummary = null;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.errorSummary = null;

        const data = action.payload;

        if (state.company) {
          state.company.summary = {
            counts: data.summary?.counts || [],
            graphs: data.summary?.graphs || undefined,
            properties: data.summary?.properties || [],
          };
          if (data.score !== undefined) state.company.score = data.score;
          if (data.badges) state.company.badges = data.badges;
        }
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.errorSummary = action.payload as string || "Özet bilgisi alınamadı";
      });
  },
});

export const {
  clearCompanyProperties,
  clearSelectedCompany,
  clearSummary,
  clearInvitationError,
  clearInvitations,
} = companySlice.actions;

export default companySlice.reducer;

