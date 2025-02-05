import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const withdrawFundsSlice = createSlice({
  name: 'withdrawFunds',
  initialState: {
    withdrawLoading: false,
    withdrawSuccessMessage: '',
    withdrawErrorMessage: '',
  },
  reducers: {
    resetWithdrawState: (state) => {
      state.withdrawSuccessMessage = '';
      state.withdrawErrorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(withdrawFundData.pending, (state) => {
        state.withdrawLoading = true;
        state.withdrawSuccessMessage = '';
        state.withdrawErrorMessage = '';
      })
      .addCase(withdrawFundData.fulfilled, (state, action) => {
        state.withdrawLoading = false;
        state.withdrawSuccessMessage = 'Transaction successful';
        state.withdrawErrorMessage = '';
      })
      .addCase(withdrawFundData.rejected, (state, action) => {
        state.withdrawLoading = false;
        state.withdrawSuccessMessage = '';
        state.withdrawErrorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const withdrawFundData = createAsyncThunk(
    'api/fund_withdraw',
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
          'api/userFundWithdrawal',
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

export const { resetWithdrawState } = withdrawFundsSlice.actions;
export default withdrawFundsSlice.reducer;

