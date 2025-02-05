import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const fundAccountPaystackSlice = createSlice({
  name: 'paystackFunding',
  initialState: {
    fundLoading: false,
    fundSuccessMessage: '',
    fundErrorMessage: '',
  },
  reducers: {
    resetPaystackState: (state) => {
      state.fundSuccessMessage = '';
      state.fundErrorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(paystackFundData.pending, (state) => {
        state.fundLoading = true;
        state.fundSuccessMessage = '';
        state.fundErrorMessage = '';
      })
      .addCase(paystackFundData.fulfilled, (state, action) => {
        state.fundLoading = false;
        state.fundSuccessMessage = 'Record updated successfully';
        state.fundErrorMessage = '';
      })
      .addCase(paystackFundData.rejected, (state, action) => {
        state.fundLoading = false;
        state.fundSuccessMessage = '';
        state.fundErrorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const paystackFundData = createAsyncThunk(
    'api/send_funds',
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
          'api/userAccount_funding',
          requestData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
          //console.log('slice feedback: ', response.data);
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

export const { resetPaystackState } = fundAccountPaystackSlice.actions;
export default fundAccountPaystackSlice.reducer;

