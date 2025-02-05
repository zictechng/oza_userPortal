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

const authSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      Object.assign(state, initialState); // Reset state to initial values
    },
    //update user details reducers here
    updateUserDetails: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // 
    },
    // update user current balance state
    updateBalance: (state, action) => {
      if (state.user) {
        state.user.userData.all_bonus_acct = action.payload; // Update the balance in the user object
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
          //console.log("Login success", action.payload);
        }
      })
     .addCase(authUserLogin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
        console.error("Login error", action.error.message);

        if (action.error.message === "Request failed with status code 401") {
          state.errorMessage = "Invalid login details supplied";
        } else if (action.error.message === "Network Error") {
          state.errorMessage = "Network problem occurred! Try again later";
        } else {
          state.errorMessage =
            action.error.message || "Something went wrong! Try again later";
        }
      })
      
    // Logout method comes here
      .addCase(authUserLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(authUserLogout.fulfilled, (state) => {
        Object.assign(state, initialState); // Reset state after successful logout
        console.log("Logout successful");
        state.loading = false;
      })
      .addCase(authUserLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Logout error", action.error.message);
      });
  },
});


export const authUserLogin = createAsyncThunk(
    "user/auth",
    async (loginData) => {
      const auth_request = await client.post(`/api/login`, loginData);
      const response = await auth_request.data;
      localStorage.setItem("authUserData", JSON.stringify(response)); // Persist data in localStorage
      return response;
    }
  );
  
  export const authUserLogout = createAsyncThunk(
    "user/logout",
    async (logout_data) => {
      try {
      const authLogout = await client.get(`/api/user_logout/${logout_data}`); // Call logout endpoint
      const response = await authLogout.data;
      return response;
      } catch (error) {
        console.error("Error during logout:", error.message);
        throw new Error("Logout failed"); // Optionally handle error
      }
    }
  );

export const { resetAuthState, updateUserDetails, updateBalance } = authSlice.actions;
export default authSlice.reducer;
