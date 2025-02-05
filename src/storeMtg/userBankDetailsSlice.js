import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const userBankDetailsSlice = createSlice({
  name: 'bankDetails',
  initialState: {
    dLoading: false,
    userBankInfo:null,
    successMessage: '',
    errorMessage: '',
    
  },
  reducers: {
    resetBankDetailsState: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserBankDetails.pending, (state) => {
        state.dLoading = true;
        state.userBankInfo = null;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(getUserBankDetails.fulfilled, (state, action) => {
        state.dLoading = false;
        state.userBankInfo = action.payload
        state.successMessage = 'Record fetched successfully';
        state.errorMessage = '';
      })
      .addCase(getUserBankDetails.rejected, (state, action) => {
        state.dLoading = false;
        state.userBankInfo = null;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const getUserBankDetails = createAsyncThunk(
    'api/bank_details',
    async (postData, { getState, rejectWithValue }) => {
      try {
        const { authUser } = getState();
        
        const myId = authUser?.user?.userData?._id;
        const userToken = authUser?.userToken;
  
        if (!myId || !userToken) {
          throw new Error('User is not authenticated');
        }
       
        // Make the API call
        const response = await client.get(
          `api/user_bankDetails/${myId}`,
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

export const { resetBankDetailsState } = userBankDetailsSlice.actions;
export default userBankDetailsSlice.reducer;

