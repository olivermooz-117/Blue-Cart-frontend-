import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import filtersReducer, { DEFAULT_WEIGHTS } from "./filtersSlice";
import historyReducer from "./historySlice";
import reviewsReducer from "./reviewsSlice";
import searchReducer from "./searchSlice";

const PERSIST_KEY = "blue-cart:filters";

function loadPersistedFilters() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return {
      filters: {
        weights: { ...DEFAULT_WEIGHTS, ...parsed.weights },
      },
    };
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filters: filtersReducer,
    auth: authReducer,
    history: historyReducer,
    reviews: reviewsReducer,
  },
  preloadedState: loadPersistedFilters(),
});

let lastWeights = store.getState().filters.weights;

// Persist filter weights to localStorage only when the weights object changes
// by reference, so a returning visitor's preferences are remembered.
store.subscribe(() => {
  const state = store.getState();
  const weights = state.filters.weights;
  if (weights === lastWeights) {
    return;
  }
  lastWeights = weights;
  try {
    localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({
        weights,
      })
    );
  } catch {
    // localStorage may be unavailable in private mode; ignore.
  }
});
