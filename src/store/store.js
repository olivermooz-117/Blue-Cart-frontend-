import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import filtersReducer from "./filtersSlice";
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
        weights: parsed.weights || { rating: 0.35, trust: 0.15 },
        priceRange: parsed.priceRange || { min: 0, max: 0 },
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

// Persist filter weights to localStorage whenever they change so the
// FilterPanel remembers a returning visitor's preferences.
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({
        weights: state.filters.weights,
        priceRange: state.filters.priceRange,
      })
    );
  } catch {
    // localStorage may be unavailable in private mode; ignore.
  }
});
