import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchColumnsThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
} from "../redux/column/columnOperations.js";
import {
  selectColumns,
  selectColumnLoading as selectIsLoading,
} from "../redux/column/columnSelectors";
import { backgroundTypes } from "./BoardModal";
import ColumnModal from "./ColumnModal";
import EditColumnModal from "./EditColumnModal";
import DeleteConfirmModal from "./DeleteColumnModal.jsx";

const BoardDetail = ({ board }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const isLoading = useSelector(selectIsLoading);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editColumn, setEditColumn] = useState(null); // { columnId, title }
  const [deleteColumn, setDeleteColumn] = useState(null); // { columnId, title }

  const bgObj = backgroundTypes.find((bg) => bg.name === board.background);
  const bgImg = bgObj ? bgObj.img : undefined;

  useEffect(() => {
    if (board?._id) {
      dispatch(fetchColumnsThunk(board._id));
    }
  }, [board?._id, dispatch]);

  const handleAddColumn = async (title) => {
    await dispatch(createColumnThunk({ boardId: board._id, title }));
    dispatch(fetchColumnsThunk(board._id));
  };

  const handleUpdateColumn = async (title) => {
    await dispatch(
      updateColumnThunk({
        boardId: board._id,
        columnId: editColumn.columnId,
        title,
      })
    );
    setEditColumn(null);

    dispatch(fetchColumnsThunk(board._id));
  };

  const handleDeleteColumn = async () => {
    await dispatch(
      deleteColumnThunk({ boardId: board._id, columnId: deleteColumn.columnId })
    );
    setDeleteColumn(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ color: "#fff" }}>{board.title}</h1>
          <div style={{ display: "flex", gap: 10 }}>
            {columns.length === 0 ? null : (
              <p
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: "12px 24px",
                  background: "#232323",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 16,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                + Add another column
              </p>
            )}
            <h1>filtre</h1>
          </div>
        </div>
      </div>

      {columns.length === 0 ? (
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "12px 24px",
            background: "#232323",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 16,
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          + Add another column
        </button>
      ) : null}

      {showAddModal && (
        <ColumnModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddColumn}
        />
      )}

      {editColumn && (
        <EditColumnModal
          currentTitle={editColumn.title}
          onClose={() => setEditColumn(null)}
          onSubmit={handleUpdateColumn}
        />
      )}

      {deleteColumn && (
        <DeleteConfirmModal
          columnTitle={deleteColumn.title}
          onClose={() => setDeleteColumn(null)}
          onConfirm={handleDeleteColumn}
        />
      )}

      {isLoading ? (
        <p style={{ color: "#ccc" }}>Loading columns...</p>
      ) : Array.isArray(columns) && columns.length > 0 ? (
        columns.map((col) => (
          <div
            key={col._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              justifyContent: "space-between",
              borderRadius: "8px",
              width: "334px",
              height: "56px",
              background: "#121212",
            }}
          >
            <span style={{ color: "#fff" }}>{col.title}</span>
            <div>
              <button
                onClick={() =>
                  setEditColumn({ columnId: col._id, title: col.title })
                }
              >
                ✏️
              </button>
              <button
                onClick={() =>
                  setDeleteColumn({ columnId: col._id, title: col.title })
                }
              >
                🗑
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: "#ccc" }}>No columns found.</p>
      )}
    </div>
  );
};

export default BoardDetail;
