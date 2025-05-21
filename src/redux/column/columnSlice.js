import { createSlice } from "@reduxjs/toolkit";
import {
  fetchColumnsThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
} from "./columnOperations.js";

const initialState = {
  columns: [],
  loading: false,
  error: null,
};

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumnsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColumnsThunk.fulfilled, (state, action) => {
        state.columns = Array.isArray(action.payload?.columns)
          ? action.payload.columns
          : [];
        state.loading = false;
      })
      .addCase(fetchColumnsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createColumnThunk.fulfilled, (state, action) => {
        state.columns.push(action.payload);
      })
      .addCase(updateColumnThunk.fulfilled, (state, action) => {
        const index = state.columns.findIndex(
          (col) => col._id === action.payload._id
        );
        if (index !== -1) state.columns[index] = action.payload;
      })
      .addCase(deleteColumnThunk.fulfilled, (state, action) => {
        state.columns = state.columns.filter(
          (col) => col._id !== action.payload
        );
      });
  },
});

export const columnReducer = columnSlice.reducer;
