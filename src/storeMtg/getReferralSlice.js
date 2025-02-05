import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from 'components/client';

const initialState = {
    referralData: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: 5, // The number of items per page
    status: 'idle',
    error: null,
    initialLoading: true, // Show loading when the page is first loaded
  paginationLoading: false, // Show overlay loader when pagination is loading
  paginationStatus: 'idle',
};

const getUserReferralSlice = createSlice({
    name: 'referral',
    initialState,
    reducers: {
      clearProducts(state) {
        state.referralData = [];
        state.status = 'idle';
        state.error = null;
        state.paginationStatus = 'idle';  // reset pagination status
        state.initialLoading = true; // Reset initial loading
      },
      setPage(state, action) {
        state.currentPage = action.payload;
        state.paginationLoading = true; 
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferral.pending, (state) => {
        state.paginationStatus = 'loading';
        if (state.paginationLoading) {
          state.paginationLoading = true; // Show overlay spinner when paginating
        } else {
          state.initialLoading = true; // Show initial loading spinner when fetching for the first time
        }
      })
      .addCase(fetchReferral.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.referralData = action.payload.data; // Save the fetched data
        state.totalPages = action.payload.totalPages; // Save the total pages from API response
        state.paginationStatus = 'idle';
        state.initialLoading = false; // Hide the initial spinner
        state.paginationLoading = false;
    })
      .addCase(fetchReferral.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to fetch referral data';
        state.initialLoading = false;
        state.paginationStatus = 'failed';
        state.paginationLoading = false;
      });
  },
});

// Async Thunk to fetch data with pagination
export const fetchReferral = createAsyncThunk(
  'history/referral_user',
  async ({ userID, user_token, page, pageSize }, { rejectWithValue }) => {
    try {
      const url = `/api/user_referralsDetails/${userID}?page=${page}&pageSize=${pageSize}`;
      const response = await client.get(url, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
    //console.log('History data:', response.data);
      return response.data; // Return both data and totalPages for pagination
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const { clearProducts, setPage } = getUserReferralSlice.actions;
export default getUserReferralSlice.reducer;
