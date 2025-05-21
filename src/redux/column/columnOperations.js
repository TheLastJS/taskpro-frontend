import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export const fetchColumnsThunk = createAsyncThunk(
  "column/fetchColumns",
  async (boardId, thunkAPI) => {
    try {
      const res = await axios.get(`/boards/${boardId}/columns`);
      return res.data.data;
    } catch (err) {
      console.error("Fetch columns error:", err);
      if (err.response?.status === 401) {
        return thunkAPI.rejectWithValue("Please login to continue");
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch columns"
      );
    }
  }
);

export const createColumnThunk = createAsyncThunk(
  "column/createColumn",
  async ({ boardId, title }, thunkAPI) => {
    try {
      const res = await axios.post(`/boards/${boardId}/columns`, { title });
      return res.data.data;
    } catch (err) {
      console.error("Create column error:", err);
      if (err.response?.status === 401) {
        return thunkAPI.rejectWithValue("Please login to continue");
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create column"
      );
    }
  }
);

export const updateColumnThunk = createAsyncThunk(
  "column/updateColumn",
  async ({ boardId, columnId, title }, thunkAPI) => {
    try {
      const res = await axios.patch(`/boards/${boardId}/columns/${columnId}`, {
        title,
      });
      return res.data.data;
    } catch (err) {
      console.error("Update column error:", err);
      if (err.response?.status === 401) {
        return thunkAPI.rejectWithValue("Please login to continue");
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update column"
      );
    }
  }
);

export const deleteColumnThunk = createAsyncThunk(
  "column/deleteColumn",
  async ({ boardId, columnId }, thunkAPI) => {
    try {
      await axios.delete(`/boards/${boardId}/columns/${columnId}`);
      return columnId;
    } catch (err) {
      console.error("Delete column error:", err);
      if (err.response?.status === 401) {
        return thunkAPI.rejectWithValue("Please login to continue");
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete column"
      );
    }
  }
);
