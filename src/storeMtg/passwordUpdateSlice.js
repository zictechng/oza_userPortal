import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";


const apiSlice = createSlice({
  name: 'passwordUpdate',
  initialState: {
    dataLoading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    resetMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(passwordUpdateData.pending, (state) => {
        state.dataLoading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(passwordUpdateData.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.successMessage = 'Record updated successfully';
        state.errorMessage = '';
      })
      .addCase(passwordUpdateData.rejected, (state, action) => {
        state.dataLoading = false;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to update request.';
      });
  },
});

// Async thunk to send post data to an API
export const passwordUpdateData = createAsyncThunk(
    'api/passwordUpdate',
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
          'api/updateUser_passwordMobile',
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

export const { resetMessages } = apiSlice.actions;
export default apiSlice.reducer;

