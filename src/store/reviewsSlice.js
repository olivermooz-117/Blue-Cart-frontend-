import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import client from "../api/client";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ query }) => {
    const response = await client.get("/search/reviews", { params: { q: query } });
    return response.data;
  }
);

export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (review) => {
    const response = await client.post("/search/reviews", review);
    return response.data;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    byQuery: {}, // query -> { reviews, status, error }
    status: "idle",
    error: null,
  },
  reducers: {
    clearReviews(state, action) {
      const { query } = action.payload;
      if (query) {
        state.byQuery[query] = { reviews: [], status: "idle", error: null };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state, action) => {
        const query = action.meta.arg.query;
        state.byQuery[query] = { reviews: [], status: "loading", error: null };
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const query = action.meta.arg.query;
        state.byQuery[query] = {
          reviews: action.payload.reviews || [],
          status: "succeeded",
          error: null,
        };
        state.status = "succeeded";
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        const query = action.meta.arg.query;
        state.byQuery[query] = {
          reviews: [],
          status: "failed",
          error: action.error.message,
        };
        state.status = "failed";
      })
      .addCase(submitReview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        const review = action.payload;
        const query = review.query;
        const current = state.byQuery[query] || { reviews: [], status: "idle", error: null };
        state.byQuery[query] = {
          reviews: [review, ...current.reviews],
          status: "succeeded",
          error: null,
        };
        state.status = "succeeded";
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
