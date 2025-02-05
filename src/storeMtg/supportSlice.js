import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  dataLoading: false,
  postData: {},
  error: null,
  errorMessage: "",
  userToken: null,
  };

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    resetPostState: (state) => {
      Object.assign(state, initialState); // Reset state to initial values
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postSupport.pending, (state) => {
        state.dataLoading = true;
        state.postData = null;
        state.error = null;
        state.errorMessage = "";
      })
      .addCase(postSupport.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.postData = action.payload;
        state.error = null;
        state.errorMessage = "";
        if (action.payload.msg === "200") {
          state.isAuth = true;
          state.userToken = action.payload.token;
          //console.log("Login success", action.payload);
        }
      })
      .addCase(postSupport.rejected, (state, action) => {
        state.dataLoading = false;
        state.postData = null;
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
      });
  },
});

// Async Thunks for login with Authorization header

export const postSupport = createAsyncThunk(
  "user/support",
  async (postData, { getState }) => {
    const { authUser } = getState(); // Access the current authUser state
    const userToken = authUser.userToken;

    const auth_request = await client.post(
      `/api/submit_ticketMobile`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // Add the Authorization header
        }
      }
    );
    const response = await auth_request.data;
    return response;
  }
);

export const { resetPostState } = supportSlice.actions;
export default supportSlice.reducer;
