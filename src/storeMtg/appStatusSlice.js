
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from 'components/client';

const initialState = {
  platformDown: false,
  loginBlocked: false,
  signupBlocked: false,
  message: '',
  loading: false,
  lastChecked: null,
};

export const fetchAppStatus = createAsyncThunk(
  'appStatus/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get('/api/app_status_check');
      if (res.data?.msg === '200') return res.data;
      return rejectWithValue('Failed');
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const appStatusSlice = createSlice({
  name: 'appStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.platformDown = action.payload.app_operation_status === true;
        state.loginBlocked = action.payload.app_stop_login_status === true;
        state.signupBlocked = action.payload.app_new_signup_status === false;
        state.message = action.payload.app_mode_message || '';
        state.lastChecked = Date.now();
      })
      .addCase(fetchAppStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default appStatusSlice.reducer;
