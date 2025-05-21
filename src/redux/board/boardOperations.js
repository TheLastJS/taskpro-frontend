import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

export const fetchBoardsThunk = createAsyncThunk(
  'board/fetchBoards',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/boards');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBoardThunk = createAsyncThunk(
  'board/createBoard',
  async (boardData, thunkAPI) => {
    try {
      const response = await axios.post('/boards', boardData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBoardThunk = createAsyncThunk(
  'board/updateBoard',
  async ({ id, title, icon, background }, thunkAPI) => {
    try {
      const response = await axios.patch(`/boards/${id}`, { title, icon, background });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBoardThunk = createAsyncThunk(
  'board/deleteBoard',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/boards/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 