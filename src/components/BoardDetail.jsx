import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchColumnsThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
} from "../redux/column/columnOperations.js";
import { addTaskThunk, fetchTasksThunk, deleteTaskThunk, updateTaskThunk } from "../redux/column/taskOperations";
import {
  selectColumns,
  selectColumnLoading as selectIsLoading,
} from "../redux/column/columnSelectors";
import { backgroundTypes } from "./BoardModal";
import { getTextColorByBackground } from "../utils/getTextColorByBackground";
import ColumnModal from "./ColumnModal";
import EditColumnModal from "./EditColumnModal";
import DeleteConfirmModal from "./DeleteColumnModal.jsx";
import AddCardModal from "./AddCardModal.jsx";
import FilterModal from "./FilterModal.jsx";
import filter from "../assets/icons/filter.svg";
import pencil from "../assets/icons/pencil.svg";
import trash from "../assets/icons/trash.svg";
import bell from "../assets/icons/bell-01.svg";
import arrowRight from "../assets/icons/arrow-circle-broken-right.svg";

const TaskCard = ({ task, columnId, onEdit, onDelete, onMove, theme }) => {
  const priorityColors = {
    Low: '#8FA1D0',
    Medium: '#E09CB5',
    High: '#BEDBB0',
    Without: '#5C5C5C',
  };
  let showBell = false;
  if (task.deadline) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0,0,0,0);
    showBell = deadlineDate <= today;
  }

  const cardBg = theme === 'light' ? '#FFFFFF' : theme === 'violet' ? '#FFFFFF' : '#232323';
  const cardTextColor = theme === 'light' ? '#232323' : theme === 'violet' ? '#232323' : '#fff';
  const cardSubTextColor = theme === 'light' ? '#8B8B8B' : theme === 'violet' ? '#8B8B8B' : '#bdbdbd';
  const cardBorderColor = theme === 'light' ? '#E8E8E8' : theme === 'violet' ? '#E8E8E8' : '#393939';
  const iconFilter = theme === 'dark' ? 'none' : 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(100%)';

  return (
    <div style={{
      background: cardBg,
      borderRadius: 12,
      padding: 0,
      marginBottom: 12,
      color: cardTextColor,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      minHeight: 64,
      borderLeft: `8px solid ${priorityColors[task.priority] || '#5C5C5C'}`,
    }}>
      <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{task.title}</div>
        {task.description && (
          <div style={{ 
            color: cardSubTextColor, 
            fontSize: 14,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4em',
            maxHeight: '2.8em'
          }}>
            {task.description}
          </div>
        )}
        <hr style={{ border: 'none', borderTop: `1px solid ${cardBorderColor}`, margin: '10px 0 6px 0' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 60 }}>
            <span style={{ color: cardSubTextColor, fontSize: 12, fontWeight: 400, marginBottom: 2 }}>Priority</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: priorityColors[task.priority] || '#5C5C5C', display: 'inline-block' }}></span>
              <span style={{ color: priorityColors[task.priority] || '#5C5C5C', fontWeight: 500, fontSize: 13 }}>{task.priority}</span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 90 }}>
            <span style={{ color: cardSubTextColor, fontSize: 12, fontWeight: 400, marginBottom: 2 }}>Deadline</span>
            <span style={{ color: cardTextColor, fontSize: 13, fontWeight: 500 }}>
              {task.deadline ? new Date(task.deadline).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {showBell && (
              <img src={bell} alt="bell" style={{ width: 18, height: 18, cursor: 'pointer' }} />
            )}
            <img src={arrowRight} alt="move" style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7, filter: iconFilter }} onClick={() => onMove && onMove(task, columnId)} />
            <img src={pencil} alt="edit" style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7, filter: iconFilter }} onClick={() => onEdit && onEdit(task, columnId)} />
            <img src={trash} alt="delete" style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7, filter: iconFilter }} onClick={() => onDelete && onDelete(task, columnId)} />
          </div>
        </div>
      </div>
    </div>
  );
};

// MoveCardModal component
function MoveCardModal({ open, card, fromColumnId, columns, onClose, boardId, theme }) {
  const dispatch = useDispatch();
  const [selectedColumn, setSelectedColumn] = useState(fromColumnId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setSelectedColumn(fromColumnId);
  }, [open, fromColumnId]);

  if (!open || !card) return null;

  const handleMove = async (e) => {
    e.preventDefault();
    if (!selectedColumn || selectedColumn === fromColumnId) return;
    setSaving(true);
    await dispatch(require('../redux/column/taskOperations').moveTaskThunk({
      boardId,
      fromColumnId,
      toColumnId: selectedColumn,
      taskId: card._id,
    }));
    setSaving(false);
    onClose();
  };

  // Tema bazlı stiller
  const getThemeStyles = () => {
    switch(theme) {
      case 'light':
        return {
          overlay: {
            background: 'rgba(0, 0, 0, 0.5)',
          },
          modal: {
            background: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
          title: {
            color: '#161616',
          },
          closeButton: {
            color: '#161616',
          },
          label: {
            color: '#5C5C5C',
          },
          select: {
            background: '#F6F6F6',
            color: '#161616',
            border: '1.5px solid #DEDEDE',
          },
          button: {
            background: '#BEDBB0',
            color: '#161616',
          }
        };
      case 'violet':
        return {
          overlay: {
            background: 'rgba(0, 0, 0, 0.5)',
          },
          modal: {
            background: '#FCFCFC',
            boxShadow: '0 4px 16px rgba(17, 17, 17, 0.1)',
          },
          title: {
            color: '#161616',
          },
          closeButton: {
            color: '#161616',
          },
          label: {
            color: '#5C5C5C',
          },
          select: {
            background: '#FCFCFC',
            color: '#161616',
            border: '1.5px solid #7B7EDE',
          },
          button: {
            background: '#5255BC',
            color: '#FFFFFF',
          }
        };
      case 'dark':
      default:
        return {
          overlay: {
            background: 'rgba(0, 0, 0, 0.7)',
          },
          modal: {
            background: '#181818',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          },
          title: {
            color: '#FFFFFF',
          },
          closeButton: {
            color: '#FFFFFF',
          },
          label: {
            color: '#FFFFFF',
          },
          select: {
            background: '#232323',
            color: '#FFFFFF',
            border: '1.5px solid #BEDBB0',
          },
          button: {
            background: '#BEDBB0',
            color: '#161616',
          }
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: themeStyles.overlay.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
    }} onClick={onClose}>
      <div 
        style={{
          background: themeStyles.modal.background,
          borderRadius: 16,
          boxShadow: themeStyles.modal.boxShadow,
          padding: '32px 32px 28px 32px',
          minWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }} 
        onClick={e => e.stopPropagation()}
      >
        <button 
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: themeStyles.closeButton.color,
            fontSize: 28,
            cursor: 'pointer',
            zIndex: 10,
            transition: 'opacity 0.2s',
          }}
          onClick={onClose}
        >
          &times;
        </button>
        <div 
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: themeStyles.title.color,
            marginBottom: 24,
            textAlign: 'left',
            width: '100%',
          }}
        >
          Move card
        </div>
        <form onSubmit={handleMove}>
          <div style={{ marginBottom: 18 }}>
            <label 
              style={{ 
                color: themeStyles.label.color, 
                fontSize: 15, 
                marginBottom: 6, 
                display: 'block' 
              }}
            >
              Select column
            </label>
            <select
              value={selectedColumn}
              onChange={e => setSelectedColumn(e.target.value)}
              style={{ 
                width: '100%', 
                padding: 10, 
                borderRadius: 8, 
                border: themeStyles.select.border, 
                background: themeStyles.select.background, 
                color: themeStyles.select.color, 
                fontSize: 16 
              }}
            >
              {columns.map(col => (
                <option key={col._id} value={col._id} disabled={col._id === fromColumnId}>
                  {col.title} {col._id === fromColumnId ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button 
            style={{ 
              borderRadius: 8,
              width: '100%',
              height: 49,
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'center',
              color: themeStyles.button.color,
              background: themeStyles.button.background,
              border: 'none',
              marginTop: 10,
              transition: 'opacity 0.2s',
              cursor: 'pointer',
              opacity: (saving || selectedColumn === fromColumnId) ? 0.6 : 1,
            }}
            type="submit" 
            disabled={saving || selectedColumn === fromColumnId}
          >
            {saving ? 'Moving...' : 'Move'}
          </button>
        </form>
      </div>
    </div>
  );
}

const BoardDetail = ({ board, theme }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const isLoading = useSelector(selectIsLoading);
  const tasksByColumn = useSelector(state => state.task.tasksByColumn);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editColumn, setEditColumn] = useState(null);
  const [deleteColumn, setDeleteColumn] = useState(null);
  const [addCardModal, setAddCardModal] = useState({ open: false, columnId: null });
  const [editCardModal, setEditCardModal] = useState({ open: false, card: null, columnId: null });
  const [deleteCardModal, setDeleteCardModal] = useState({ open: false, card: null, columnId: null });
  const [moveCardModal, setMoveCardModal] = useState({ open: false, card: null, fromColumnId: null });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const bgObj = backgroundTypes.find((bg) => bg.name === board.background);
  const textColor = getTextColorByBackground(board.background || '', theme);
  const columnBg = theme === 'light' ? '#FFFFFF' : theme === 'violet' ? '#FFFFFF' : '#121212';
  const columnTextColor = theme === 'light' ? '#232323' : theme === 'violet' ? '#232323' : '#FFFFFF';
  const columnIconFilter = theme === 'dark' ? 'none' : 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(100%)';

  // Tema uyumlu buton renkleri
  const getButtonStyles = () => {
    switch(theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          color: '#161616',
          border: '1px solid #E8E8E8',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        };
      case 'violet':
        return {
          background: '#FFFFFF',
          color: '#161616',
          border: '1px solid #E0E1DD',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        };
      case 'dark':
      default:
        return {
          background: '#121212',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: 'none'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  // Filtrelenmiş görevleri hesapla
  const getFilteredTasks = (tasks) => {
    if (selectedFilters.length === 0) {
      return tasks;
    }
    return tasks.filter(task => selectedFilters.includes(task.priority));
  };

  useEffect(() => {
    if (board?._id) {
      dispatch(fetchColumnsThunk(board._id));
    }
  }, [board?._id, dispatch]);

  useEffect(() => {
    if (Array.isArray(columns)) {
      columns.forEach(col => {
        if (col._id && board?._id) {
          dispatch(fetchTasksThunk({ boardId: board._id, columnId: col._id }));
        }
      });
    }
  }, [columns, board?._id, dispatch]);

  const handleAddColumn = async (title) => {
    await dispatch(createColumnThunk({ boardId: board._id, title }));
    dispatch(fetchColumnsThunk(board._id));
  };

  const handleUpdateColumn = async (title) => {
    await dispatch(updateColumnThunk({
      boardId: board._id,
      columnId: editColumn.columnId,
      title,
    }));
    setEditColumn(null);
    dispatch(fetchColumnsThunk(board._id));
  };

  const handleDeleteColumn = async () => {
    await dispatch(deleteColumnThunk({ columnId: deleteColumn.columnId }));
    setDeleteColumn(null);
  };

  const handleEditCard = (card, columnId) => {
    setEditCardModal({ open: true, card, columnId });
  };

  const handleDeleteCard = (card, columnId) => {
    setDeleteCardModal({ open: true, card, columnId });
  };

  const handleConfirmDeleteCard = async () => {
    if (!deleteCardModal.card || !deleteCardModal.columnId) return;
    await dispatch(deleteTaskThunk({
      boardId: board._id,
      columnId: deleteCardModal.columnId,
      taskId: deleteCardModal.card._id,
    }));
    setDeleteCardModal({ open: false, card: null, columnId: null });
  };

  const handleEditCardSave = async (values) => {
    if (!values._id) return;
    await dispatch(updateTaskThunk({
      boardId: board._id,
      columnId: editCardModal.columnId,
      taskId: values._id,
      title: values.title,
      description: values.desc,
      priority: values.label,
      deadline: values.deadline ? values.deadline.toISOString() : undefined,
    }));
    setEditCardModal({ open: false, card: null, columnId: null });
  };

  const handleMoveCard = (card, fromColumnId) => {
    setMoveCardModal({ open: true, card, fromColumnId });
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        top: 64,
        backdropFilter: "blur(2px)",
        zIndex: 15,
        paddingRight: 32,
        position: "fixed",
        margin: 0,
        left: 260,
        right: 0,
        padding: "10px 32px",
      }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ color: textColor, margin: 0 }}>{board.title}</h1>
          {columns.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: buttonStyles.background,
                color: buttonStyles.color,
                border: buttonStyles.border || "none",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 16,
                marginTop: 8,
                marginBottom: 16,
                cursor: "pointer",
                textAlign: "left",
                transition: "opacity 0.2s",
                boxShadow: buttonStyles.boxShadow || "none",
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              + Add column
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {columns.length > 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: buttonStyles.background,
                color: buttonStyles.color,
                border: buttonStyles.border || "none",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "opacity 0.2s",
                boxShadow: buttonStyles.boxShadow || "none",
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              + Add another column
            </button>
          )}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              cursor: "pointer",
            }}
            onClick={() => setShowFilterModal(true)}
          >
            <img src={filter} alt="Filter" style={{
              width: 16,
              height: 14,
              marginRight: 4,
              filter: textColor === '#ffffff' ? 
                "brightness(0) saturate(100%) invert(82%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(82%) contrast(100%)" :
                "brightness(0) saturate(100%) invert(26%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(26%) contrast(100%)",
            }}></img>
            <h1 style={{
              color: textColor,
              margin: 0,
              marginRight: 32,
              fontSize: "14px",
              letterSpacing: "-0.02em",
            }}>
              Filters
            </h1>
          </div>
        </div>
      </div>

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
          title={deleteColumn.title}
          type="column"
          onClose={() => setDeleteColumn(null)}
          onConfirm={handleDeleteColumn}
        />
      )}

      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <p style={{ color: "#ccc" }}>Loading columns...</p>
      ) : Array.isArray(columns) && columns.length > 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          marginTop: 32,
          overflow: "hidden",
          height: "calc(100vh - 138px)",
          alignItems: "flex-start",
        }}>
          {columns.map((col, colIdx) => {
            const allTasks = tasksByColumn[col._id] || [];
            const filteredTasks = getFilteredTasks(allTasks);
            
            return (
              <div key={col._id || colIdx} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "334px",
                marginBottom: 16,
                overflowX: "hidden",
                height: '100%',
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  justifyContent: "space-between",
                  borderRadius: "8px",
                  width: "334px",
                  height: "56px",
                  background: columnBg,
                }}>
                  <span style={{ color: columnTextColor }}>{col.title}</span>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <img
                      style={{ cursor: "pointer", filter: columnIconFilter }}
                      src={pencil}
                      alt="pencil"
                      onClick={() => setEditColumn({ columnId: col._id, title: col.title })}
                    />
                    <img
                      style={{ cursor: "pointer", filter: columnIconFilter }}
                      src={trash}
                      alt="trash"
                      onClick={() => setDeleteColumn({ columnId: col._id, title: col.title })}
                    />
                  </div>
                </div>
                <div style={{ width: '100%', marginTop: 16, height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden', flex: 1 }}>
                  <div style={{ overflowY: 'auto', minHeight: 0, overflowX: 'hidden' }}>
                    {filteredTasks.length > 0 && filteredTasks.map((task, taskIdx) => (
                      <TaskCard
                        key={task._id || taskIdx}
                        task={task}
                        columnId={col._id}
                        onEdit={handleEditCard}
                        onDelete={handleDeleteCard}
                        onMove={handleMoveCard}
                        theme={theme}
                      />
                    ))}
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "16px 0",
                      borderRadius: 8,
                      background: theme === 'violet' ? '#5255BC' : "#bedbb0",
                      color: theme === 'violet' ? '#FFFFFF' : "#161616",
                      border: "none",
                      fontWeight: 500,
                      fontSize: 16,
                      marginTop: 8,
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                      flexShrink: 0,
                    }}
                    onClick={() => setAddCardModal({ open: true, columnId: col._id })}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    + Add another card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <p style={{ color: "#ccc", fontSize: 24, textAlign: "center" }}>No columns found.</p>
        </div>
      )}

      <AddCardModal
        open={addCardModal.open}
        columnId={addCardModal.columnId}
        boardId={board._id}
        onClose={() => setAddCardModal({ open: false, columnId: null })}
        onAdd={(task) => {
          dispatch(addTaskThunk({
            boardId: board._id,
            columnId: task.columnId,
            title: task.title,
            description: task.desc,
            priority: task.label,
            deadline: task.deadline ? task.deadline.toISOString() : undefined,
          }));
        }}
      />
      {editCardModal.open && (
        <AddCardModal
          open={editCardModal.open}
          columnId={editCardModal.columnId}
          boardId={board._id}
          onClose={() => setEditCardModal({ open: false, card: null, columnId: null })}
          onAdd={handleEditCardSave}
          initialValues={editCardModal.card}
          editMode={true}
        />
      )}
      {deleteCardModal.open && (
        <DeleteConfirmModal
          title={deleteCardModal.card?.title || ""}
          type="card"
          onClose={() => setDeleteCardModal({ open: false, card: null, columnId: null })}
          onConfirm={handleConfirmDeleteCard}
        />
      )}
      {moveCardModal.open && (
        <MoveCardModal
          open={moveCardModal.open}
          card={moveCardModal.card}
          fromColumnId={moveCardModal.fromColumnId}
          columns={columns}
          onClose={() => setMoveCardModal({ open: false, card: null, fromColumnId: null })}
          boardId={board._id}
          theme={theme}
        />
      )}
    </div>
  );
};

export default BoardDetail;