import { createSlice } from '@reduxjs/toolkit';
import { addTaskThunk, fetchTasksThunk } from './taskOperations';

const initialState = {
  tasksByColumn: {}, // { [columnId]: [task, ...] }
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        const { columnId, tasks } = action.payload;
        state.tasksByColumn[columnId] = tasks;
        state.loading = false;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        const { columnId, task } = action.payload;
        if (!state.tasksByColumn[columnId]) state.tasksByColumn[columnId] = [];
        state.tasksByColumn[columnId].push(task);
      })
      .addCase(require('./taskOperations').deleteTaskThunk.fulfilled, (state, action) => {
        const { columnId, taskId } = action.payload;
        if (state.tasksByColumn[columnId]) {
          state.tasksByColumn[columnId] = state.tasksByColumn[columnId].filter(task => task._id !== taskId);
        }
      })
      .addCase(require('./taskOperations').updateTaskThunk.fulfilled, (state, action) => {
        const { columnId, task } = action.payload;
        if (state.tasksByColumn[columnId]) {
          const idx = state.tasksByColumn[columnId].findIndex(t => t._id === task._id);
          if (idx !== -1) {
            state.tasksByColumn[columnId][idx] = task;
          }
        }
      })
      .addCase(require('./taskOperations').moveTaskThunk.fulfilled, (state, action) => {
        const { fromColumnId, toColumnId, task } = action.payload;
        // Remove from old column
        if (state.tasksByColumn[fromColumnId]) {
          state.tasksByColumn[fromColumnId] = state.tasksByColumn[fromColumnId].filter(t => t._id !== task._id);
        }
        // Add to top of new column
        if (!state.tasksByColumn[toColumnId]) state.tasksByColumn[toColumnId] = [];
        state.tasksByColumn[toColumnId] = [task, ...state.tasksByColumn[toColumnId]];
      });
  },
});

export const taskReducer = taskSlice.reducer; 