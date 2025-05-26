import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchColumnsThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
} from "../redux/column/columnOperations.js";
import {
  addTaskThunk,
  fetchTasksThunk,
  deleteTaskThunk,
  updateTaskThunk,
} from '../redux/column/taskOperations';
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { reorderColumnsThunk, reorderTasksThunk } from '../redux/column/reorderThunks';

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

const SortableColumn = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const SortableCard = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
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
  const [columnOrder, setColumnOrder] = useState([]);
  const [tasksOrder, setTasksOrder] = useState({});
  const [activeId, setActiveId] = useState(null);

  //const bgObj = backgroundTypes.find((bg) => bg.name === board.background);
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

  useEffect(() => {
    setColumnOrder(columns.map((col) => col._id));
    const newTasksOrder = {};
    columns.forEach((col) => {
      newTasksOrder[col._id] = (tasksByColumn[col._id] || []).map((task) => task._id);
    });
    setTasksOrder(newTasksOrder);
  }, [columns, tasksByColumn]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Eğer bir yere bırakılmadıysa (column dışına bırakıldı), hiçbir işlem yapma
    if (!over) {
      return; // Kartı eski yerine otomatik döndür
    }

    // Sürüklenen öğenin card mı column mu olduğunu kontrol et
    const isDraggingCard = Object.values(tasksOrder).some((arr) => arr.includes(active.id));
    const isDraggingColumn = columnOrder.includes(active.id);

    // Eğer card sürükleniyorsa
    if (isDraggingCard) {
      // Hedefin geçerli olup olmadığını kontrol et (başka bir card veya column olmalı)
      const isValidTarget =
        Object.values(tasksOrder).some((arr) => arr.includes(over.id)) || // Başka bir card
        columnOrder.includes(over.id); // Veya bir column

      // Geçersiz hedefe bırakıldıysa hiçbir işlem yapma
      if (!isValidTarget) {
        return; // Kartı eski yerine otomatik döndür
      }
    }

    // Eğer column sürükleniyorsa
    if (isDraggingColumn) {
      // Hedefin başka bir column olup olmadığını kontrol et
      if (!columnOrder.includes(over.id)) {
        return; // Column'u eski yerine otomatik döndür
      }
    }

    // Column drag
    if (columnOrder.includes(active.id) && columnOrder.includes(over.id)) {
      if (active.id !== over.id) {
        const oldIndex = columnOrder.indexOf(active.id);
        const newIndex = columnOrder.indexOf(over.id);
        const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
        setColumnOrder(newOrder);
        // Backend'e yeni sıralama gönder
        dispatch(reorderColumnsThunk({ boardId: board._id, columnOrder: newOrder }));
      }
    } else {
      // Card drag
      const fromColumnId = Object.keys(tasksOrder).find((colId) =>
        tasksOrder[colId].includes(active.id)
      );

      // toColumnId'yi bulurken hem task'ların olduğu column'ları hem de boş column'ları kontrol et
      let toColumnId = Object.keys(tasksOrder).find((colId) => tasksOrder[colId].includes(over.id));

      // Eğer over.id bir columnId ise (boş column'a bırakıldı)
      if (!toColumnId && columnOrder.includes(over.id)) {
        toColumnId = over.id;
      }

      if (fromColumnId && toColumnId) {
        if (fromColumnId === toColumnId) {
          // Aynı kolonda kart sırası değişti
          const oldIndex = tasksOrder[fromColumnId].indexOf(active.id);
          const newIndex = tasksOrder[toColumnId].indexOf(over.id);
          const newTasks = arrayMove(tasksOrder[fromColumnId], oldIndex, newIndex);
          setTasksOrder({ ...tasksOrder, [fromColumnId]: newTasks });
          // Backend'e yeni sıralama gönder
          dispatch(
            reorderTasksThunk({ boardId: board._id, columnId: fromColumnId, taskOrder: newTasks })
          );
        } else {
          // Farklı kolona kart taşındı
          const fromTasks = tasksOrder[fromColumnId].filter((id) => id !== active.id);

          // Hedef column'da task var mı kontrol et
          let toTasks;
          if (tasksOrder[toColumnId] && tasksOrder[toColumnId].includes(over.id)) {
            // Başka bir task'ın üzerine bırakıldı
            const toIndex = tasksOrder[toColumnId].indexOf(over.id);
            toTasks = [...tasksOrder[toColumnId]];
            toTasks.splice(toIndex, 0, active.id);
          } else {
            // Boş column'a veya column'un en altına bırakıldı
            toTasks = [...(tasksOrder[toColumnId] || []), active.id];
          }

          // Önce UI'ı güncelle
          setTasksOrder({
            ...tasksOrder,
            [fromColumnId]: fromTasks,
            [toColumnId]: toTasks,
          });

          // Backend'e task'ı yeni column'a taşı
          dispatch(
            updateTaskThunk({
              boardId: board._id,
              columnId: fromColumnId,
              taskId: active.id,
              column: toColumnId,
            })
          )
            .then(() => {
              // Task taşıma başarılı - UI zaten güncellendi, ek bir şey yapmaya gerek yok
              console.log('Task başarıyla taşındı');
            })
            .catch((error) => {
              console.error('Task taşıma hatası:', error);
              // Hata durumunda UI'ı eski haline döndür
              setTasksOrder({
                ...tasksOrder,
                [fromColumnId]: [...tasksOrder[fromColumnId]],
                [toColumnId]: [...tasksOrder[toColumnId]],
              });
            });
        }
      }
    }
    setActiveId(null);
  };

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
    await dispatch(deleteColumnThunk({ boardId: board._id, columnId: deleteColumn.columnId }));
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
      <div
        style={{
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
          padding: "12px 32px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ color: textColor, margin: 0 }}>{board.title}</h1>
          {columns.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: "#121212",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 16,
                marginTop: 8,
                marginBottom: 16,
                cursor: "pointer",
                textAlign: "left",
              }}
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
                background: "#121212",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
              }}
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
          >
            <img
              src={filter}
              alt="Filter"
              style={{
                width: 16,
                height: 14,
                marginRight: 4,
                filter: textColor === '#ffffff' ? 
                  "brightness(0) saturate(100%) invert(82%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(82%) contrast(100%)" :
                  "brightness(0) saturate(100%) invert(26%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(26%) contrast(100%)",
              }}
            ></img>
            <h1
              style={{
                color: textColor,
                margin: 0,
                marginRight: 32,
                fontSize: "14px",
                letterSpacing: "-0.02em",
              }}
            >
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
          columnTitle={deleteColumn.title}
          onClose={() => setDeleteColumn(null)}
          onConfirm={handleDeleteColumn}
        />
      )}
  
      {isLoading ? (
        <p style={{ color: "#ccc" }}>Loading columns...</p>
      ) : Array.isArray(columns) && columns.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 24,
                marginTop: 32,
                overflow: "hidden",
                height: "calc(100vh - 138px)",
                alignItems: "flex-start",
              }}
            >
              {columnOrder.map((columnId) => {
                const column = columns.find((col) => col._id === columnId);
                if (!column) return null;
                const tasks = tasksByColumn[column._id] || [];
                
                return (
                  <SortableColumn key={column._id} id={column._id}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "334px",
                        marginBottom: 16,
                        overflowX: "hidden",
                        height: '100%',
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "20px",
                          justifyContent: "space-between",
                          borderRadius: "8px",
                          width: "334px",
                          height: "56px",
                          background: columnBg,
                        }}
                      >
                        <span style={{ color: columnTextColor }}>{column.title}</span>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <img
                            style={{ cursor: "pointer", filter: columnIconFilter }}
                            src={pencil}
                            alt="pencil"
                            onClick={() =>
                              setEditColumn({ columnId: column._id, title: column.title })
                            }
                          />
                          <img
                            style={{ cursor: "pointer", filter: columnIconFilter }}
                            src={trash}
                            alt="trash"
                            onClick={() =>
                              setDeleteColumn({ columnId: column._id, title: column.title })
                            }
                          />
                        </div>
                      </div>
                      
                      <div style={{ width: '100%', marginTop: 16, height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden', flex: 1 }}>
                        <SortableContext
                          items={tasksOrder[column._id] || []}
                          strategy={verticalListSortingStrategy}
                        >
                          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, overflowX: 'hidden' }}>
                            {(tasksOrder[column._id] || []).map((taskId) => {
                              const task = tasks.find((t) => t._id === taskId);
                              if (!task) return null;
                              return (
                                <SortableCard key={task._id} id={task._id}>
                                  <TaskCard
                                    task={task}
                                    columnId={column._id}
                                    onEdit={handleEditCard}
                                    onDelete={handleDeleteCard}
                                    onMove={handleMoveCard}
                                    theme={theme}
                                  />
                                </SortableCard>
                              );
                            })}
                          </div>
                        </SortableContext>
                        
                        <button
                          style={{
                            width: "100%",
                            padding: "16px 0",
                            borderRadius: 8,
                            background: theme === 'violet' ? '#5255BC' : "#bedbb0",
                            color: theme === 'violet' ? '#FFFFFF' : "#151515",
                            border: "none",
                            fontWeight: 500,
                            fontSize: 16,
                            marginTop: 8,
                            cursor: "pointer",
                            transition: "background 0.2s",
                            flexShrink: 0,
                          }}
                          onClick={() => setAddCardModal({ open: true, columnId: column._id })}
                        >
                          + Add another card
                        </button>
                      </div>
                    </div>
                  </SortableColumn>
                );
              })}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeId
              ? (() => {
                  // Eğer activeId bir column ise
                  if (columnOrder.includes(activeId)) {
                    const column = columns.find((col) => col._id === activeId);
                    return column ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '20px',
                          justifyContent: 'space-between',
                          borderRadius: '8px',
                          width: '334px',
                          height: '56px',
                          background: columnBg,
                          opacity: 0.8,
                          transform: 'rotate(5deg)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        }}
                      >
                        <span style={{ color: columnTextColor }}>{column.title}</span>
                      </div>
                    ) : null;
                  }
  
                  // Eğer activeId bir task ise
                  const columnId = Object.keys(tasksOrder).find((colId) =>
                    tasksOrder[colId].includes(activeId)
                  );
                  if (columnId) {
                    const task = (tasksByColumn[columnId] || []).find((t) => t._id === activeId);
                    return task ? (
                      <div
                        style={{
                          opacity: 0.8,
                          transform: 'rotate(5deg)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        }}
                      >
                        <TaskCard task={task} columnId={columnId} theme={theme} />
                      </div>
                    ) : null;
                  }
  
                  return null;
                })()
              : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
          columnTitle={deleteCardModal.card?.title || ""}
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
        />
      )}
    </div>
  );
}

export default BoardDetail;