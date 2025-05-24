// Kart ve kolon sırası güncelleme thunk'ları
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Kolon sırası güncelleme
export const reorderColumnsThunk = createAsyncThunk(
  'column/reorderColumns',
  async ({ boardId, columnOrder }, thunkAPI) => {
    try {
      await axios.patch(`/boards/${boardId}/columns/reorder`, { columnOrder });
      return columnOrder;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to reorder columns');
    }
  }
);

// Kart sırası güncelleme (bir kolonda)
export const reorderTasksThunk = createAsyncThunk(
  'task/reorderTasks',
  async ({ boardId, columnId, taskOrder }, thunkAPI) => {
    try {
      await axios.patch(`/boards/${boardId}/columns/${columnId}/tasks/reorder`, { taskOrder });
      return { columnId, taskOrder };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to reorder tasks');
    }
  }
);