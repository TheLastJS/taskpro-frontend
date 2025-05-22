export const selectColumns = (state) => state.column.columns;
export const selectColumnLoading = (state) => state.column.loading;
export const selectColumnError = (state) => state.column.error;
export const selectTasksByColumn = (columnId) => (state) => state.task.tasksByColumn[columnId] || [];
