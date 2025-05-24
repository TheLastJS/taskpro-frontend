import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Add a new task to a column
export const addTaskThunk = createAsyncThunk(
  'task/addTask',
  async ({ boardId, columnId, title, description, priority, deadline }, thunkAPI) => {
    try {
      const res = await axios.post(`/boards/${boardId}/columns/${columnId}/task`, {
        title,
        description,
        priority,
        deadline,
      });
      return { columnId, task: res.data.data.task };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add task');
    }
  }
);

// Fetch all tasks for a column
export const fetchTasksThunk = createAsyncThunk(
  'task/fetchTasks',
  async ({ boardId, columnId }, thunkAPI) => {
    try {
      const res = await axios.get(`/boards/${boardId}/columns/${columnId}/task`);
      return { columnId, tasks: res.data.data.tasks };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

// Delete a task from a column
export const deleteTaskThunk = createAsyncThunk(
  'task/deleteTask',
  async ({ boardId, columnId, taskId }, thunkAPI) => {
    try {
      await axios.delete(`/boards/${boardId}/columns/${columnId}/task/${taskId}`);
      return { columnId, taskId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

// Update a task in a column
export const updateTaskThunk = createAsyncThunk(
  'task/updateTask',
  async (
    { boardId, columnId, taskId, title, description, priority, deadline, column },
    thunkAPI
  ) => {
    try {
      const res = await axios.patch(`/boards/${boardId}/columns/${columnId}/task/${taskId}`, {
        title,
        description,
        priority,
        deadline,
        column
      });
      return { columnId, task: res.data.data.task };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

// Move a task to another column
export const moveTaskThunk = createAsyncThunk(
  'task/moveTask',
  async ({ boardId, fromColumnId, toColumnId, taskId }, thunkAPI) => {
    try {
      const res = await axios.patch(`/boards/${boardId}/columns/${fromColumnId}/task/${taskId}`, {
        column: toColumnId,
      });
      return { fromColumnId, toColumnId, task: res.data.data.task };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to move task');
    }
  }
); 