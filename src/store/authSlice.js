import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import client from "../api/client";

export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  const response = await client.post("/auth/login", { email, password });
  return response.data;
});

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }) => {
    const response = await client.post("/auth/register", { email, password });
    return response.data;
  }
);