import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from 'components/client';

const initialState = {
    documentData: [],
    docCurrentPage: 1,
    docTotalPages: 1,
    pageSize: 5, 
    status: 'idle',
    error: null,
    docInitialLoading: true,
  documentLoading: false,
  docPaginationStatus: 'idle',
};

const getDocumentUploadSlice = createSlice({
    name: 'uploadedDocuments',
    initialState,
    reducers: {
      clearDocument(state) {
        state.documentData = [];
        state.status = 'idle';
        state.error = null;
        state.docPaginationStatus = 'idle';  // reset pagination status
        state.docInitialLoading = true; // Reset initial loading
      },
      setDocPage(state, action) {
        state.currentPage = action.payload;
        state.documentLoading = true; 
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocument.pending, (state) => {
        state.docPaginationStatus = 'loading';
        if (state.documentLoading) {
          state.documentLoading = true; // Show overlay spinner when paginating
        } else {
          state.docInitialLoading = true; // Show initial loading spinner when fetching for the first time
        }
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documentData = action.payload.data; // Save the fetched data
        state.totalPages = action.payload.totalPages; // Save the total pages from API response
        state.docPaginationStatus = 'idle';
        state.docInitialLoading = false; // Hide the initial spinner
        state.documentLoading = false;
    })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to fetch referral data';
        state.docInitialLoading = false;
        state.docPaginationStatus = 'failed';
        state.documentLoading = false;
      });
  },
});

// Async Thunk to fetch data with pagination
export const fetchDocument = createAsyncThunk(
  'user/documentUpload',
  async ({ userID, user_token, page, pageSize }, { rejectWithValue }) => {
    try {
      const url = `/api/user_documentUpload/${userID}?page=${page}&pageSize=${pageSize}`;
      const response = await client.get(url, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
        //console.log('My Doc data:', response.data);
      return response.data; // Return both data and totalPages for pagination
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const { clearDocument, setDocPage } = getDocumentUploadSlice.actions;
export default getDocumentUploadSlice.reducer;
