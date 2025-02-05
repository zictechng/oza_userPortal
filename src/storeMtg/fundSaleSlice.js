import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const fundSaleSlice = createSlice({
  name: 'sellFunds',
  initialState: {
    fundLoading: false,
    fundSuccessMessage: '',
    fundErrorMessage: '',
  },
  reducers: {
    resetSaleState: (state) => {
      state.fundSuccessMessage = '';
      state.fundErrorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sellFundData.pending, (state) => {
        state.fundLoading = true;
        state.fundSuccessMessage = '';
        state.fundErrorMessage = '';
      })
      .addCase(sellFundData.fulfilled, (state, action) => {
        state.fundLoading = false;
        state.fundSuccessMessage = 'Transaction successful';
        state.fundErrorMessage = '';
      })
      .addCase(sellFundData.rejected, (state, action) => {
        state.fundLoading = false;
        state.fundSuccessMessage = '';
        state.fundErrorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const sellFundData = createAsyncThunk(
    'api/fund_sell',
    async (postData, { getState, rejectWithValue }) => {
      try {
        const { authUser } = getState();
        
        const myId = authUser?.user?.userData?._id;
        const userToken = authUser?.userToken;
  
        if (!myId || !userToken) {
          throw new Error('User is not authenticated');
        }
        const requestData = {
            myId, 
          ...postData,
        };
  
        // Make the API call
        const response = await client.post(
          'api/fundPurchase_funding',
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

export const { resetSaleState } = fundSaleSlice.actions;
export default fundSaleSlice.reducer;

