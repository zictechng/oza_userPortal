// src/storeMtg/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  loading: false,
  user: null,
  error: null,
  errorMessage: "",
  userToken: null,
  isAuth: false,
};

// ─── Define ALL async thunks FIRST, before the slice ──────────────────────────

export const authUserLogin = createAsyncThunk(
  "user/auth",
  async (loginData) => {
    const auth_request = await client.post(`/api/login`, loginData);
    const response = await auth_request.data;
    localStorage.setItem("authUserData", JSON.stringify(response));
    return response;
  }
);

export const authUserLogout = createAsyncThunk(
  "user/logout",
  async (logout_data) => {
    try {
      const authLogout = await client.get(`/api/user_logout/${logout_data}`);
      return await authLogout.data;
    } catch (error) {
      console.error("Error during logout:", error.message);
      throw new Error("Logout failed");
    }
  }
);

export const refreshUserProfile = createAsyncThunk(
  "user/refreshProfile",
  async ({ userID, user_token }, { rejectWithValue }) => {
    try {
      const response = await client.get(`/api/user_wallet_profile/${userID}`, {
        headers: { Authorization: `Bearer ${user_token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to refresh profile");
    }
  }
);

// ─── Now define the slice (thunks are fully defined above) ────────────────────

const authSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      Object.assign(state, initialState);
    },
    updateUserDetails: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateBalance: (state, action) => {
      if (state.user) {
        state.user.userData.all_bonus_acct = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(authUserLogin.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
        state.errorMessage = "";
      })
      .addCase(authUserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.errorMessage = "";
        if (action.payload.msg === "200") {
          state.isAuth = true;
          state.userToken = action.payload.token;
        }
      })
      .addCase(authUserLogin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
        if (action.error.message === "Request failed with status code 401") {
          state.errorMessage = "Invalid login details supplied";
        } else if (action.error.message === "Network Error") {
          state.errorMessage = "Network problem occurred! Try again later";
        } else {
          state.errorMessage = action.error.message || "Something went wrong! Try again later";
        }
      })

      // ── Refresh Profile ──
      .addCase(refreshUserProfile.fulfilled, (state, action) => {
        if (action.payload?.msg === "200" && state.user?.userData) {
          state.user.userData = {
            ...state.user.userData,
            ...action.payload.userData,
          };
        }
      })

      // ── Logout ──
      .addCase(authUserLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(authUserLogout.fulfilled, (state) => {
        Object.assign(state, initialState);
        state.loading = false;
      })
      .addCase(authUserLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetAuthState, updateUserDetails, updateBalance } = authSlice.actions;
export default authSlice.reducer;