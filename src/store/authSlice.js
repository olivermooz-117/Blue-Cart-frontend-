import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import client, { getErrorMessage } from "../api/client";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await client.post("/auth/login", { email, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Something went wrong, please try again"));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await client.post("/auth/register", { email, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Something went wrong, please try again"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: localStorage.getItem("email"),
    token: localStorage.getItem("token"),
    status: "idle",
    error: null,
    expired: false,
  },
  reducers: {
    logout(state) {
      state.email = null;
      state.token = null;
      state.expired = false;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    },
    sessionExpired(state) {
      state.token = null;
      state.email = null;
      state.expired = true;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => [login.pending.type, register.pending.type].includes(action.type),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [login.fulfilled.type, register.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = "succeeded";
          state.expired = false;
          state.email = action.payload.email;
          state.token = action.payload.access_token;
          localStorage.setItem("token", action.payload.access_token);
          localStorage.setItem("email", action.payload.email);
        }
      )
      .addMatcher(
        (action) => [login.rejected.type, register.rejected.type].includes(action.type),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload ?? action.error.message;
        }
      );
  },
});

export const { logout, sessionExpired, clearAuthError } = authSlice.actions;
export default authSlice.reducer;