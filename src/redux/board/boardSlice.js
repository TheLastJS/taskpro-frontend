import { createSlice } from '@reduxjs/toolkit';
import { fetchBoardsThunk, createBoardThunk, updateBoardThunk, deleteBoardThunk } from './boardOperations';

const initialState = {
  boards: [],
  loading: false,
  error: null,
  selectedBoardId: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSelectedBoard(state, action) {
      state.selectedBoardId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardsThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.boards = payload;
      })
      .addCase(fetchBoardsThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || 'Board listesi alınamadı';
      })
      .addCase(createBoardThunk.fulfilled, (state, { payload }) => {
        state.boards.push(payload);
        state.selectedBoardId = payload._id;
      })
      .addCase(updateBoardThunk.fulfilled, (state, { payload }) => {
        const idx = state.boards.findIndex(b => b._id === payload._id);
        if (idx !== -1) {
          state.boards[idx] = { ...state.boards[idx], ...payload };
        }
      })
      .addCase(deleteBoardThunk.fulfilled, (state, { payload }) => {
        state.boards = state.boards.filter(b => b._id !== payload);
        if (state.selectedBoardId === payload) {
          state.selectedBoardId = state.boards.length > 0 ? state.boards[0]._id : null;
        }
      });
  },
});

export const { setSelectedBoard } = boardSlice.actions;
export const boardReducer = boardSlice.reducer; 