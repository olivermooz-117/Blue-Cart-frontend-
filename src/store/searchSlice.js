import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import client, { getErrorMessage } from "../api/client";

export const runSearch = createAsyncThunk(
  "search/runSearch",
  async (query, { rejectWithValue }) => {
    try {
      const response = await client.get("/search", { params: { q: query } });
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Something went wrong, please try again"));
    }
  }
);

export const rerankResults = createAsyncThunk(
  "search/rerankResults",
  async ({ listings, weights }, { rejectWithValue }) => {
    try {
      const response = await client.post("/search/filter", { listings, weights });
      return response.data.results;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Something went wrong, please try again"));
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    allResults: [],
    sites: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    currentRequestId: undefined,
    reranking: false,
    rerankError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(runSearch.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta?.requestId;
      })
      .addCase(runSearch.fulfilled, (state, action) => {
        if (action.meta?.requestId !== state.currentRequestId) {
          return;
        }
        state.status = "succeeded";
        state.query = action.payload.query;
        state.results = action.payload.results;
        state.allResults = action.payload.results;
        state.sites = action.payload.sites || [];
        state.currentRequestId = undefined;
      })
      .addCase(runSearch.rejected, (state, action) => {
        if (action.meta?.requestId !== state.currentRequestId) {
          return;
        }
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
        state.currentRequestId = undefined;
      })
      .addCase(rerankResults.pending, (state) => {
        state.reranking = true;
        state.rerankError = null;
      })
      .addCase(rerankResults.fulfilled, (state, action) => {
        state.results = action.payload;
        state.reranking = false;
        state.rerankError = null;
      })
      .addCase(rerankResults.rejected, (state, action) => {
        state.reranking = false;
        state.rerankError = action.payload ?? action.error.message;
      });
  },
});

export default searchSlice.reducer;
