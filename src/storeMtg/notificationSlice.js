import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from 'components/client';

const initialState = {
    notificationData: [],
    allNotifications: [], // accumulated across all pages for correct counts
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    status: 'idle',
    error: null,
    initialLoading: true,
    paginationLoading: false,
    paginationStatus: 'idle',
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
      clearNotifications(state) {
        state.notificationData = [];
        state.status = 'idle';
        state.error = null;
        state.paginationStatus = 'idle';  // reset pagination status
        state.initialLoading = true;
        },
      setPage(state, action) {
        state.currentPage = action.payload;
        state.paginationLoading = true; 
        state.paginationStatus = 'loading';
      },
      resetPage(state) {
        state.currentPage = 1;  // Reset page number to 1 when page mounts
      },
      markRead: (state, action) => {
      const id = action.payload;
      const notif = state.notificationData.find(n => n._id === id);
      if (notif) notif.alert_status = 0;
      const all = state.allNotifications.find(n => n._id === id);
      if (all) all.alert_status = 0;
    },
    },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationHistory.pending, (state) => {
        state.paginationStatus = 'loading';
        if (state.paginationLoading) {
          state.paginationLoading = true; // Show overlay spinner when paginating
        } else {
          state.initialLoading = true; // Show initial loading spinner when fetching for the first time
        }
      })
       .addCase(getNotificationHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newData = action.payload.data || [];
        // Replace current page data
        state.notificationData = newData;
        // Accumulate all pages for accurate counts
        if (action.payload.currentPage === 1) {
          state.allNotifications = newData;
        } else {
          // Merge avoiding duplicates
          const existingIds = new Set(state.allNotifications.map(n => n._id));
          const fresh = newData.filter(n => !existingIds.has(n._id));
          state.allNotifications = [...state.allNotifications, ...fresh];
        }
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount || 0;
        state.paginationStatus = 'idle';
        state.initialLoading = false;
        state.paginationLoading = false;
      })
      .addCase(getNotificationHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.initialLoading = false;
        state.paginationStatus = 'failed';
        state.paginationLoading = false;
      });
  },
});

// Async Thunk to fetch data with pagination
export const getNotificationHistory = createAsyncThunk(
  'user/notifications',
  async ({ userID, user_token, page, pageSize }, { rejectWithValue }) => {
    try {
      const url = `/api/user_notification/${userID}?page=${page}&pageSize=${pageSize}`;
      const response = await client.get(url, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      //console.log('History data:', response.data);
      return response.data; // Return both data and totalPages for pagination
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const { clearNotifications, setPage, resetPage, markRead } = notificationSlice.actions;
export default notificationSlice.reducer;
