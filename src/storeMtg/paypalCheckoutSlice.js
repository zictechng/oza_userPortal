import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "components/client";

const paypalPaymentSlice = createSlice({
  name: "paypalPayment",
  initialState: {
    paymentData: {},
    approvalUrl: null,
    isLoading: false,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    // 🔹 Save PayPal approval URL when payment is created
    setPaypalApprovalUrl: (state, action) => {
      state.approvalUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaypalPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaypalPayment.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(getPaypalPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(capturePaypalPayment.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      // Capture Payment - Success
      .addCase(capturePaypalPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.paymentData = action.payload;
      })
      // Capture Payment - Error
      .addCase(capturePaypalPayment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});


// Async action for processing PayPal payment
export const getPaypalPayment = createAsyncThunk(
    "payment/paypalPayment",
    async (paymentData, { getState, rejectWithValue }) => {
      try {
        // Extract user token and ID from Redux store
        const { authUser } = getState();
        const userToken = authUser?.userToken;
        const myId = authUser?.user?.userData?._id
        
        if (!userToken) throw new Error("User is not authenticated");
  
        // Include user ID in the payment data
        const requestData = { ...paymentData, myId };
  
        // Send payment data to backend with Authorization header using Axios
        const { data } = await client.post("/api/create-payment", requestData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
  
        return data;
      } catch (error) {
        // Handle errors properly
        return rejectWithValue(
          error.response?.data?.message || error.message || "Payment failed"
        );
      }
    }
  );
  
  // Async action for capturing PayPal payment
  export const capturePaypalPayment = createAsyncThunk(
    "payment/capturePaypalPayment",
    async ( dataSend, { getState, rejectWithValue }) => {
      try {
        const { authUser } = getState();
        const userToken = authUser?.userToken;
          
        if (!userToken) throw new Error("User is not authenticated");
        // Send request to backend to capture payment
        const response= await client.post(
        'api/capture-payment', dataSend,
            {
            // headers: {
            //     Authorization: `Bearer ${userToken}`,
            // },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            }
        );
        return response.data; // Return response from backend
      } catch (error) {
        return rejectWithValue(error.response?.data || "Payment failed");
      }
    }
  );

export const { setPaypalApprovalUrl } = paypalPaymentSlice.actions;
export default paypalPaymentSlice.reducer;
