import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from 'components/client';

const initialState = {
  recentData: [], // Ensure this matches what you're updating
  status: 'idle',
  error: null,
};

const dashRecentRecordSlice = createSlice({
  name: 'recentTransaction',
  initialState,
  reducers: {
    clearProducts(state) {
      state.recentData = [];
      state.status = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recentData = action.payload; // Ensure correct state key is updated
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Async Thunk to fetch product details
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ userID, user_token }, { rejectWithValue }) => {
    try {
      const url = `/api/recent_transactions/${userID}`;
      const response = await client.get(url, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      //console.log('recent Data', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const { clearProducts } = dashRecentRecordSlice.actions;
export default dashRecentRecordSlice.reducer;
