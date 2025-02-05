import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  data: {},
  errorMessage: "",
  dataLoading: false,
  dataError: null,
};

const checkPaymentGatewayStatus = createSlice({
  name: "paymentGatewayStatus",
  initialState,
  reducers: {
      resetPaymentGatewayState(state) {
      state.data = {};
      state.errorMessage = "";
      state.dataLoading = false;
      state.dataError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentGateStatus.pending, (state) => {
        state.dataLoading = true;
        state.data = null;
        state.dataError = null;
      })
      .addCase(getPaymentGateStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.dataLoading = false;
        state.dataError = null;
      })
      .addCase(getPaymentGateStatus.rejected, (state, action) => {
        console.error("Data Bonus error", action.payload || action.error.message);
        state.dataLoading = false;
        state.data = null;
        state.dataError = action.payload || action.error.message;
        state.errorMessage = action.payload || action.error.message || "";
      });
  },
});

// Custom method to handle API call with dynamic parameters being passed into it
export const getPaymentGateStatus = createAsyncThunk(
    "user/getPaymentGate",
    async (_, thunkAPI) => { // Include `_` as the first argument placeholder
      const { authUser } = thunkAPI.getState(); // Access the current authUser state
      const userToken = authUser?.userToken; // Ensure token exists
  
      try {
        const response = await client.get(`/api/check_paymentBtn`, {
          headers: {
            Authorization: `Bearer ${userToken}`, // Add the authorization token
          },
        });
  
        //console.log("Rate Feedback:", response.data.app_payStack_btn);
        return response.data;
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const { resetPaymentGatewayState } = checkPaymentGatewayStatus.actions;
export default checkPaymentGatewayStatus.reducer;
