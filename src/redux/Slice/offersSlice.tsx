import { createSlice } from '@reduxjs/toolkit';
import { getOffers, getSentOffers } from '../../../api';

interface PropertyState {
    offerList: any[];
    proposalsList: any[];
    loadingOffers: boolean;
    loadingProposals: boolean;
    errorOffers: string | null;
    errorProposals: string | null;
    detail: string | null;
    loading: boolean;
    property: any[];
}

const initialState: PropertyState = {
    offerList: [],
    proposalsList: [],
    loadingOffers: false,
    loadingProposals: false,
    errorOffers: null,
    errorProposals: null,
    detail: null,
    loading: false,
    property: [],
};

const propertySlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      
        builder
            .addCase(getOffers.pending, (state) => {
                state.loadingOffers = true;
                state.errorOffers = null;
            })
            .addCase(getOffers.fulfilled, (state, action) => {
                state.loadingOffers = false;
                state.offerList = action.payload;
            })
            .addCase(getOffers.rejected, (state, action) => {
                state.loadingOffers = false;
                state.errorOffers = action.payload as string;
            });

      
        builder
            .addCase(getSentOffers.pending, (state) => {
                state.loadingProposals = true;
                state.errorProposals = null;
            })
            .addCase(getSentOffers.fulfilled, (state, action) => {
                state.loadingProposals = false;
                state.proposalsList = action.payload; 
            })
            .addCase(getSentOffers.rejected, (state, action) => {
                state.loadingProposals = false;
                state.errorProposals = action.payload as string;
            });
    },
});

export default propertySlice.reducer;