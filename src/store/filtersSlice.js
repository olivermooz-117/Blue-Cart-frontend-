import { createSlice } from "@reduxjs/toolkit";

export const DEFAULT_WEIGHTS = {
  price: 0.5,
  rating: 0.35,
  trust: 0.15,
};

export const WEIGHTS_INFO = {
  price: {
    label: "Price",
    hint: "Higher = favor cheaper listings",
  },
  rating: {
    label: "Product rating",
    hint: "Higher = favor listings with better star ratings",
  },
  trust: {
    label: "Payment safety",
    hint: "Higher = favor listings that let you pay after delivery and are well rated",
  },
};

const initialState = {
  weights: { ...DEFAULT_WEIGHTS },
  priceRange: { min: 0, max: 0 },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setWeight(state, action) {
      const { key, value } = action.payload;
      state.weights[key] = value;
    },
    setPriceRange(state, action) {
      const { min, max } = action.payload;
      state.priceRange = { min, max };
    },
  },
});

export const { setWeight, setPriceRange } = filtersSlice.actions;
export default filtersSlice.reducer;
