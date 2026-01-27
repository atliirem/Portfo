import { createSlice } from "@reduxjs/toolkit";
import {
  getOffersDetail,
  getReceivedOffers,
  getSentOffers,
  getProposals,
  getProposalDetail, 
  replyToOffer,
  getCustomerProposals,
} from "../../../api";

interface OffersState {
  offerList: any[];
  loadingOffers: boolean;
  errorOffers: string | null;

  proposalsList: any[];
  loadingProposals: boolean;
  errorProposals: string | null;

  proposalDetail: any | null; 
  loadingProposalDetail: boolean; 


  selectedOffer: any | null;

  replyLoading: boolean;
}

const initialState: OffersState = {
  offerList: [],
  loadingOffers: false,
  errorOffers: null,

  proposalsList: [],
  loadingProposals: false,
  errorProposals: null,

  proposalDetail: null,  
  loadingProposalDetail: false, 

  selectedOffer: null,

  replyLoading: false,
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    resetSentOffers: (state) => {
      state.proposalsList = [];
      state.loadingProposals = false;
      state.errorProposals = null;
    },
    resetReceivedOffers: (state) => {
      state.offerList = [];
      state.loadingOffers = false;
      state.errorOffers = null;
    },
    resetSelectedOffer: (state) => {
      state.selectedOffer = null;
    },
    resetProposalDetail: (state) => { 
      state.proposalDetail = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(getReceivedOffers.pending, (state) => {
        state.loadingOffers = true;
        state.errorOffers = null;
      })
      .addCase(getReceivedOffers.fulfilled, (state, action) => {
        state.loadingOffers = false;
        state.offerList = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(getReceivedOffers.rejected, (state, action) => {
        state.loadingOffers = false;
        state.errorOffers = action.payload as string;
      });

    // Sent Offers
    builder
      .addCase(getSentOffers.pending, (state) => {
        state.loadingProposals = true;
        state.errorProposals = null;
      })
      .addCase(getSentOffers.fulfilled, (state, action) => {
        state.loadingProposals = false;
        state.proposalsList = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(getSentOffers.rejected, (state, action) => {
        state.loadingProposals = false;
        state.errorProposals = action.payload as string;
      });

    builder
      .addCase(getProposals.pending, (state) => {
        state.loadingProposals = true;
        state.errorProposals = null;
      })
      .addCase(getProposals.fulfilled, (state, action) => {
        state.loadingProposals = false;
        state.proposalsList = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(getProposals.rejected, (state, action) => {
        state.loadingProposals = false;
        state.errorProposals = action.payload as string;
      });

builder
  .addCase(getCustomerProposals.pending, (state) => {
    state.loadingProposals = true;
    state.errorProposals = null;
    state.proposalsList = [];
  })
  .addCase(getCustomerProposals.fulfilled, (state, action) => {
    state.loadingProposals = false;


    state.proposalsList = action.payload?.data?.proposals ?? [];
  })
  .addCase(getCustomerProposals.rejected, (state, action) => {
    state.loadingProposals = false;
    state.errorProposals = action.payload as string;
  });

    builder
      .addCase(getOffersDetail.pending, (state) => {
        state.loadingOffers = true;
        state.errorOffers = null;
      })
   .addCase(getProposalDetail.fulfilled, (state, action) => {
  state.loadingProposalDetail = false;
  state.proposalDetail = action.payload?.data ?? action.payload ?? null;
})
      .addCase(getOffersDetail.rejected, (state, action) => {
        state.loadingOffers = false;
        state.errorOffers = action.payload as string;
      });


    builder
      .addCase(replyToOffer.pending, (state) => {
        state.replyLoading = true;
      })
      .addCase(replyToOffer.fulfilled, (state, action) => {
        state.replyLoading = false;

        const { id, type } = action.meta.arg;

        const newStatus =
          type === "confirm"
            ? { key: "confirm", title: "Onaylandı" }
            : { key: "reject", title: "Reddedildi" };

        if (state.selectedOffer?.id === id) {
          state.selectedOffer = {
            ...state.selectedOffer,
            status: newStatus,
          };
        }

        state.offerList = state.offerList.map((offer) =>
          offer.id === id ? { ...offer, status: newStatus } : offer
        );
      })
      .addCase(replyToOffer.rejected, (state) => {
        state.replyLoading = false;
      });
  },
});

export const {
  resetSentOffers,
  resetReceivedOffers,
  resetSelectedOffer,
  resetProposalDetail, 
} = offersSlice.actions;

export default offersSlice.reducer;