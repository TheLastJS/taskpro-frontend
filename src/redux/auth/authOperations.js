import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";
import { authService } from "../../services/authService";

axios.defaults.baseURL = "http://localhost:3000";


export const registerThunk = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {

      await axios.post("/auth/register", credentials);
      // Kayıt sonrası otomatik login
      const response = await axios.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      const token = response.data?.data?.accessToken;
      const user = response.data?.data?.user;
      if (!token) throw new Error("Token alınamadı!");
      return { token, user };
    } catch (error) {
      // API'den gelen spesifik hata mesajını kontrol et
      if (error.response?.status === 409) {
        return thunkAPI.rejectWithValue("This email is already registered");
      }
      // Diğer hata durumları için
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );

    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {

      const response = await axios.post("/auth/login", credentials);
      console.log("LOGIN RESPONSE:", response.data);
      const token = response.data?.data?.accessToken;
      const user = response.data?.data?.user;
      if (!token) throw new Error("Token alınamadı!");
      return { token, user };

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