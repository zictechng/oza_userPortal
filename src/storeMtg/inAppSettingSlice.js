import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "components/client";

const initialState = {
  dataLoading: false,
  postData: {},
  postStatus: '',
  error: null,
  errorMessage: "",
  };

const f2aSettingSlice = createSlice({
  name: "inAppNotification",
  initialState,
  reducers: {
    resetPostState: (state) => {
      Object.assign(state, initialState); // Reset state to initial values
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postInAppNotification.pending, (state) => {
        state.dataLoading = true;
        state.postData = null;
        state.postStatus = null;
        state.error = null;
        state.errorMessage = "";
      })
      .addCase(postInAppNotification.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.postData = action.payload;
        state.error = null;
        state.errorMessage = "";
        if (action.payload.msg === "200") {
          state.postStatus = action.payload.msg;
          //console.log("Login success", action.payload);
        }
      })
      .addCase(postInAppNotification.rejected, (state, action) => {
        state.dataLoading = false;
        state.postData = null;
        state.postStatus = null;
        state.error = action.error.message;
        console.error(" Error ", action.error.message);

        if (action.error.message === "Request failed with status code 401") {
          state.errorMessage = "Access daniel";
        } else if (action.error.message === "Network Error") {
          state.errorMessage = "Network problem occurred! Try again later";
        } else {
          state.errorMessage =
            action.error.message || "Something went wrong! Try again later";
        }
      });
  },
});

// Async

export const postInAppNotification = createAsyncThunk(
  "user/f2a_mode",
  async (status_value, { getState }) => {
    const { authUser } = getState(); // Access the current authUser state
    const userToken = authUser.userToken;
    let postData = {
        user_Id: authUser.user.userData._id,
        status_value
    }
    const setting_request = await client.post(
      `/api/user_notice_request`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // Add the Authorization header
        }
      }
    );
    const response = await setting_request.data;
     return response;
  }
);

export const { resetPostState } = f2aSettingSlice.actions;
export default f2aSettingSlice.reducer;
