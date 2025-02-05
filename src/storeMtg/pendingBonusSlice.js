import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  data: {},
  errorMessage: "",
  dataLoading: false,
  dataError: null,
};

const pendingBonusSlice = createSlice({
  name: "pendingBonus",
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
      .addCase(getPendingBonus.pending, (state) => {
        state.dataLoading = true;
        state.data = null;
        state.dataError = null;
      })
      .addCase(getPendingBonus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.dataLoading = false;
        state.dataError = null;
      })
      .addCase(getPendingBonus.rejected, (state, action) => {
        console.error("Data Bonus error", action.payload || action.error.message);
        state.dataLoading = false;
        state.data = null;
        state.dataError = action.payload || action.error.message;
        state.errorMessage = action.payload || action.error.message || "";
      });
  },
});

// Custom method to handle API call with dynamic parameters
export const getPendingBonus = createAsyncThunk(
    "pendingBonus/get",
    async ({ tag_id, user_token, endpoint }, thunkAPI) => {
      try {
        const url = endpoint || `/api/user_Wallet_summary/${tag_id}`; // Use dynamic endpoint or default
        const response = await client.get(url, {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const { resetState } = pendingBonusSlice.actions;
export default pendingBonusSlice.reducer;
