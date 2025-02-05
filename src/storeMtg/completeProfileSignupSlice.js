import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const completeProfileSignupSlice = createSlice({
  name: 'completeSignup',
  initialState: {
    profileLoading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    resetProfileState: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userProfileUpdateData.pending, (state) => {
        state.profileLoading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(userProfileUpdateData.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.successMessage = 'Record updated successfully';
        state.errorMessage = '';
      })
      .addCase(userProfileUpdateData.rejected, (state, action) => {
        state.profileLoading = false;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const userProfileUpdateData = createAsyncThunk(
    'user/complete_profile',
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
          'api/complete_registration',
          requestData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log('slice Result:', response.data);
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

export const { resetProfileState } = completeProfileSignupSlice.actions;
export default completeProfileSignupSlice.reducer;

