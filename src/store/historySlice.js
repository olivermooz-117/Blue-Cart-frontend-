import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import client, { getErrorMessage } from "../api/client";

export const fetchHistory = createAsyncThunk(
  "history/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get("/history", { params: { limit: 50 } });
      return { items: response.data.history || [], total: response.data.total ?? 0 };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to load history."));
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
    total: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default historySlice.reducer;
