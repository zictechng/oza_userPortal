import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  bankData: {},
  cErrorMessage: "",
  cLoading: false,
  cDataError: null,
};

const companyBankInfoSlice = createSlice({
  name: "companyBankInfo",
  initialState,
  reducers: {
      resetState(state) {
      state.data = {};
      state.cErrorMessage = "";
      state.cLoading = false;
      state.cDataError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyBankInfo.pending, (state) => {
        state.cLoading = true;
        state.data = null;
        state.cDataError = null;
      })
      .addCase(getCompanyBankInfo.fulfilled, (state, action) => {
        state.data = action.payload;
        state.cLoading = false;
        state.cDataError = null;
      })
      .addCase(getCompanyBankInfo.rejected, (state, action) => {
        console.error("Data Bonus error", action.payload || action.error.message);
        state.cLoading = false;
        state.data = null;
        state.cDataError = action.payload || action.error.message;
        state.cErrorMessage = action.payload || action.error.message || "";
      });
  },
});

// Custom method to handle API call with dynamic parameters being passed into it
export const getCompanyBankInfo = createAsyncThunk(
    "user/getCompanyBankInfo",
    async (_, thunkAPI) => { // Include `_` as the first argument placeholder
      try {
        const response = await client.get('/api/fetchBankInfo');
  
       // console.log("Company Bank Feedback:", response);
        return response.data;
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const { resetState } = companyBankInfoSlice.actions;
export default companyBankInfoSlice.reducer;
