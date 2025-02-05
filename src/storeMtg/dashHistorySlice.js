import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from 'components/client';

const initialState = {
    historyData: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: 10, // The number of items per page
    status: 'idle',
    error: null,
    initialLoading: true, // Show loading when the page is first loaded
  paginationLoading: false, // Show overlay loader when pagination is loading
  paginationStatus: 'idle',
};

const dashHistorySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
      clearHistoryData(state) {
        state.historyData = [];
        state.status = 'idle';
        state.error = null;
        state.paginationStatus = 'idle';  // reset pagination status
        state.initialLoading = true; // Reset initial loading
      },
      setPage(state, action) {
        state.currentPage = action.payload;
        state.paginationLoading = true; 
      },
      resetPage(state) {
        state.currentPage = 1;  // Reset page number to 1 when page mounts
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.paginationStatus = 'loading';
        if (state.paginationLoading) {
          state.paginationLoading = true; // Show overlay spinner when paginating
        } else {
          state.initialLoading = true; // Show initial loading spinner when fetching for the first time
        }
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.historyData = action.payload.data; // Save the fetched data
        state.totalPages = action.payload.totalPages; // Save the total pages from API response
        state.paginationStatus = 'idle';
        state.initialLoading = false; // Hide the initial spinner
        state.paginationLoading = false;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.initialLoading = false;
        state.paginationStatus = 'failed';
        state.paginationLoading = false;
      });
  },
});

// Async Thunk to fetch data with pagination
export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async ({ userID, user_token, page, pageSize }, { rejectWithValue }) => {
    try {
      const url = `/api/all_userHistory/${userID}?page=${page}&pageSize=${pageSize}`;
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

export const { clearHistoryData, setPage,resetPage } = dashHistorySlice.actions;
export default dashHistorySlice.reducer;
