import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.register(credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      const data = await authService.getCurrentUser();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Refresh failed");
    }
  }
);