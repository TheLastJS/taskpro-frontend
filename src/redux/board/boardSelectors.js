export const selectBoards = state => state.board.boards;
export const selectBoardsLoading = state => state.board.loading;
export const selectBoardsError = state => state.board.error;
export const selectSelectedBoardId = state => state.board.selectedBoardId;
export const selectSelectedBoard = state => {
  const id = state.board.selectedBoardId;
  return state.board.boards.find(b => b._id === id) || null;
}; 