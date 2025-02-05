import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  data: {},
  errorMessage: "",
  dataLoading: false,
  dataError: null,
};

const fundingLimitRateSlice = createSlice({
  name: "fundingLimit",
  initialState,
  reducers: {
      resetState(state) {
      state.data = {};
      state.errorMessage = "";
      state.dataLoading = false;
      state.dataError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFundLimitRate.pending, (state) => {
        state.dataLoading = true;
        state.data = null;
        state.dataError = null;
      })
      .addCase(getFundLimitRate.fulfilled, (state, action) => {
        state.data = action.payload;
        state.dataLoading = false;
        state.dataError = null;
      })
      .addCase(getFundLimitRate.rejected, (state, action) => {
        state.dataLoading = false;
        state.data = null;
        state.dataError = action.payload || action.error.message;
        state.errorMessage = action.payload || action.error.message || "";
      });
  },
});

// Custom method to handle API call with dynamic parameters being passed into it
export const getFundLimitRate = createAsyncThunk(
    "user/getLimit",
    async (postData, { getState, rejectWithValue }) => { // Include `_` as the first argument placeholder
        const { authUser } = getState();
        const userId = authUser?.user?.userData?._id;
        const userToken = authUser?.userToken;
            const requestData = {
                userId, 
            ...postData,
             };
      try {
        const response = await client.post('/api/check_fundingLimit',
        requestData, {
          headers: {
            Authorization: `Bearer ${userToken}`, // Add the authorization token
          },
        });
  
        //console.log("Fund Limit Feedback:", response);
        return response.data;
      } catch (error) {
        console.error('Error updating password:', error);
        // Handle server errors (e.g., 400 or 500 responses) or network issues
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

export const { resetState } = fundingLimitRateSlice.actions;
export default fundingLimitRateSlice.reducer;
