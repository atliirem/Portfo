import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCustomer, getAllCompanies, getCompany, getCustomers, getOffers, getSummary, getTeam, updateCustomer , getCompanyTeam} from "../../../api";

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

interface Company {
  id: number;
  name: string;
  creator: string;
  logo: string;
  type: string;
  code: string;
  score?: number;
  updated_at: string;
  created_at: string;
  website?: string;
  email?: string;
  phone?: string;
  summary: { counts: any[] };
  properties: any[];
  personals?: Personal[];
  customers?: Customer[];
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

export interface CompanyState {
  company: Company | null;

  offers: Offer[];
  personals: Personal[];
  loading: boolean;
  error: string | null;
  customers: Customer[];
}

const initialState: CompanyState = {
  company: null,
  offers: [],
  personals: [],
  loading: false,
  error: null,
  customers: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
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
      .addCase(getAllCompanies.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.company = action.payload;
        state.personals = action.payload.personals || [];
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Şirket bilgisi alınamadı.";
      })



      .addCase(getOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOffers.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(getOffers.rejected, (state, action) => {
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

       .addCase(getCompanyTeam.pending, (state) => {
        state.loading = true;
      })
.addCase(getCompanyTeam.fulfilled, (state, action) => {
    state.loading = false;

    const personals = action.payload?.personals;

    state.personals = Array.isArray(personals) ? personals : [];
})

      .addCase(getCompanyTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;

        state.customers = action.payload?.data || action.payload || [];
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(deleteCustomer.pending, (state) => {
      
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.meta.arg;

        state.customers = state.customers.filter(
          (customer) => customer.id !== deletedId as any
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



    .addCase(updateCustomer.pending, (state) => {
      
    })
    .addCase(updateCustomer.fulfilled, (state, action) => {

      const { id, data } = action.payload;
      state.customers = state.customers.map((c) =>
        c.id === id ? { ...c, ...data } : c
      );
    })
    .addCase(updateCustomer.rejected, (state, action) => {

      state.error = (action.payload as string) ?? "Müşteri güncellenemedi";
    })




      .addCase(getSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.loading = false;
        if (state.company) {
          state.company.summary = action.payload.summary;
        }
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Özet bilgisi alınamadı.";
      });
  },
});

export default companySlice.reducer;
