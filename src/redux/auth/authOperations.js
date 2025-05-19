import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




export const registerThunk = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {


        return {
            ...thunkAPI,
        }

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
)


export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      console.log("LOGIN RESPONSE:", response.data);
      const token = response.data?.data?.accessToken;
      if (!token) throw new Error("Token alınamadı!");
      return { token };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("persist:auth");
      return true;
    } catch (error) {
      console.error("logoutThunk hata:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const savedToken = thunkAPI.getState().auth.token;
    if (savedToken) {
      
    } else {
      return thunkAPI.rejectWithValue("Token doesn't exist");
    }

    try {
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);