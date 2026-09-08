
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";
import { updateUserDetails } from "storeMtg/authSlice";

const verifyPaystackSlice = createSlice({
  name: 'verifyPaystack',
  initialState: {
    loading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    resetVerifyState: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPaystackPayment.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(verifyPaystackPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Payment verified successfully';
      })
      .addCase(verifyPaystackPayment.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Verification failed';
      });
  },
});

export const verifyPaystackPayment = createAsyncThunk(
  'api/verify_paystack',
  async (postData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { authUser } = getState();
      const userToken = authUser?.userToken;

      const response = await client.post(
        'api/verify_paystack_payment',
        postData,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      // Update Redux store with new balance instantly
      if (response.data?.userData) {
        dispatch(updateUserDetails({ userData: response.data.userData }));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'An unexpected error occurred'
      );
    }
  }
);

export const { resetVerifyState } = verifyPaystackSlice.actions;
export default verifyPaystackSlice.reducer;