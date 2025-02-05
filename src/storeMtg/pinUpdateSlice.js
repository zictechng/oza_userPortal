import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const apiSlice = createSlice({
  name: 'accountPin',
  initialState: {
    acctLoading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    resetAccountState: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accountPinUpdateData.pending, (state) => {
        state.acctLoading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(accountPinUpdateData.fulfilled, (state, action) => {
        state.acctLoading = false;
        state.successMessage = 'Record updated successfully';
        state.errorMessage = '';
      })
      .addCase(accountPinUpdateData.rejected, (state, action) => {
        state.acctLoading = false;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const accountPinUpdateData = createAsyncThunk(
    'api/reset_pin',
    async (postData, { getState, rejectWithValue }) => {
      try {
        const { authUser } = getState();
        
        const userId = authUser?.user?.userData?._id;
        const userToken = authUser?.userToken;
  
        if (!userId || !userToken) {
          throw new Error('User is not authenticated');
        }
        const requestData = {
            userId, 
          ...postData,
        };
  
        // Make the API call
        const response = await client.post(
          'api/updateUser_AccountPinMobile',
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

export const { resetAccountState } = apiSlice.actions;
export default apiSlice.reducer;

