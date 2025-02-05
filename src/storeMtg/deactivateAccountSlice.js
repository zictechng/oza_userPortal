import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const deactivateAccountSlice = createSlice({
  name: 'deactivateAccount',
  initialState: {
    deleteLoading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    resetDeactivateState: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deactivateAccountData.pending, (state) => {
        state.deleteLoading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(deactivateAccountData.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.successMessage = 'Record updated successfully';
        state.errorMessage = '';
      })
      .addCase(deactivateAccountData.rejected, (state, action) => {
        state.deleteLoading = false;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const deactivateAccountData = createAsyncThunk(
    'api/reset_pin',
    async (postData, { getState, rejectWithValue }) => {
      try {
        const { authUser } = getState();
        
        const uid = authUser?.user?.userData?._id;
        const userToken = authUser?.userToken;
  
        if (!uid || !userToken) {
          throw new Error('User is not authenticated');
        }
        const requestData = {
            uid, 
           };
  
        // Make the API call
        const response = await client.post(
          'api/block_AccountMobile',
          requestData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
         return response.data;
  
      } catch (error) {
        console.error('Error updating password:', error);
        // Handle server errors (e.g., 400 or 500 responses) or network issues
        return rejectWithValue(
          error.response?.data || 'An unexpected error occurred'
        );
      }
    }
  );

export const { resetDeactivateState } = deactivateAccountSlice.actions;
export default deactivateAccountSlice.reducer;

