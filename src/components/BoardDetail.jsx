import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchColumnsThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
} from '../redux/column/columnOperations.js';
import {
  addTaskThunk,
  fetchTasksThunk,
  deleteTaskThunk,
  updateTaskThunk,
} from '../redux/column/taskOperations';
import {
  selectColumns,
  selectColumnLoading as selectIsLoading,
  selectTasksByColumn,
} from '../redux/column/columnSelectors';
import { backgroundTypes } from './BoardModal';
import { getTextColorByBackground } from '../utils/getTextColorByBackground';
import ColumnModal from './ColumnModal';
import EditColumnModal from './EditColumnModal';
import DeleteConfirmModal from './DeleteColumnModal.jsx';
import filter from '../assets/icons/filter.svg';
import pencil from '../assets/icons/pencil.svg';
import trash from '../assets/icons/trash.svg';
import bell from '../assets/icons/bell-01.svg';
import arrowRight from '../assets/icons/arrow-circle-broken-right.svg';
import styles from './UserInfo/UserInfo.module.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
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

const LABELS = [
  { color: '#8FA1D0', name: 'Low' },
  { color: '#E09CB5', name: 'Medium' },
  { color: '#BEDDB0', name: 'High' },
  { color: '#5C5C5C', name: 'Without' },
];

function AddCardModal({
  open,
  onClose,
  onAdd,
  columnId,
  boardId,
  initialValues = {},
  editMode = false,
}) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [desc, setDesc] = useState(initialValues.description || '');
  const [label, setLabel] = useState(initialValues.priority || 'Without');
  const [deadline, setDeadline] = useState(
    initialValues.deadline ? dayjs(initialValues.deadline) : dayjs()
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [touched, setTouched] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (open) {
      setTitle(initialValues.title || '');
      setDesc(initialValues.description || '');
      setLabel(initialValues.priority || 'Without');
      setDeadline(initialValues.deadline ? dayjs(initialValues.deadline) : dayjs());
      setTouched(false);
      setShowCalendar(false);
    }
  }, [open]);

  if (!open) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!title.trim()) return;
    onAdd &&
      onAdd({
        title,
        desc,
        label,
        deadline,
        columnId,
        _id: initialValues._id, // pass id for edit
      });
    onClose();
  };

  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        style={{ minWidth: 370, maxWidth: 400 }}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div
          className={styles.modalTitle}
          style={{
            marginBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0,
          }}
        >
          <span style={{ marginBottom: 18 }}>{editMode ? 'Edit card' : 'Add card'}</span>
          {touched && !title.trim() && (
            <span
              style={{
                color: '#ff6b6b',
                fontSize: 15,
                fontWeight: 500,
                marginBottom: 10,
                marginTop: 2,
              }}
            >
              Please fill the title field
            </span>
          )}
        </div>
        <form
          className={styles.formArea}
          onSubmit={handleAdd}
          autoComplete='off'
          style={{ marginTop: 10 }}
        >
          <input
            className={styles.inputArea}
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            autoFocus
            style={touched && !title.trim() ? { border: '2px solid #ff6b6b' } : {}}
          />
          <textarea
            className={styles.inputArea}
            placeholder='Description'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            style={{ resize: 'none', minHeight: 80 }}
          />
          <div style={{ margin: '8px 0 0 0', width: '100%' }}>
            <div style={{ marginBottom: 6, fontSize: 14, color: '#fff' }}>Label color</div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              {LABELS.map((l) => (
                <label
                  key={l.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <input
                    type='radio'
                    name='label'
                    value={l.name}
                    checked={label === l.name}
                    onChange={() => setLabel(l.name)}
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      width: 16,
                      height: 16,
                      margin: 0,
                      left: 0,
                      top: 0,
                      zIndex: 2,
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: l.color,
                      display: 'inline-block',
                      border: label === l.name ? '2px solid #fff' : '2px solid #232323',
                      boxSizing: 'border-box',
                      zIndex: 1,
                    }}
                  ></span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ margin: '12px 0 0 0', width: '100%' }}>
            <div style={{ fontSize: 14, color: '#fff', marginBottom: 4 }}>Deadline</div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='tr'>
              <DatePicker
                value={deadline}
                onChange={(val) => setDeadline(val)}
                format='DD.MM.YYYY'
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: {
                      background: '#232323',
                      color: '#fff',
                      border: '1.5px solid #bedbb0',
                      borderRadius: '8px',
                      '& input': {
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 16,
                        textAlign: 'left',
                      },
                      '& fieldset': { border: 'none' },
                      width: '100%',
                    },
                    InputProps: {
                      style: { color: '#fff' },
                    },
                  },
                  openPickerButton: {
                    sx: {
                      color: '#bedbb0',
                    },
                  },
                  popper: {
                    sx: {
                      zIndex: 4000,
                      '& .MuiPaper-root': {
                        background: '#232323',
                        color: '#fff',
                        borderRadius: '12px',
                      },
                      '& .MuiPickersDay-root': {
                        color: '#fff',
                        background: 'transparent',
                        borderRadius: '50%',
                        '&:hover': {
                          background: '#bedbb0',
                          color: '#232323',
                        },
                      },
                      '& .Mui-selected': {
                        background: '#bedbb0 !important',
                        color: '#232323 !important',
                      },
                      '& .MuiPickersDay-today': {
                        border: '1.5px solid #bedbb0',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#fff',
                      },
                      '& .MuiPickersCalendarHeader-switchViewButton': {
                        color: '#bedbb0',
                      },
                      '& .MuiIconButton-root': {
                        color: '#bedbb0',
                      },
                      '& .MuiPickersYear-yearButton': {
                        color: '#fff',
                        '&.Mui-selected': {
                          background: '#bedbb0',
                          color: '#232323',
                        },
                      },
                      '& .MuiPickersMonth-monthButton': {
                        color: '#fff',
                        '&.Mui-selected': {
                          background: '#bedbb0',
                          color: '#232323',
                        },
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#fff',
                        fontWeight: 500,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <button
            className={styles.sendBtn}
            type='submit'
            style={{
              marginTop: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {editMode ? (
              'Save'
            ) : (
              <>
                <span style={{ fontSize: 20, marginRight: 4 }}>+</span> Add
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const TaskCard = ({ task, columnId, onEdit, onDelete, onMove, theme }) => {
  const priorityColors = {
    Low: '#8FA1D0',
    Medium: '#E09CB5',
    High: '#BEDDB0',
    Without: '#5C5C5C',
  };
  let showBell = false;
  if (task.deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    showBell = deadlineDate <= today;
  }

  // Tema renklerine göre card arkaplanı ve yazı rengi
  const cardBg = theme === 'light' ? '#FFFFFF' : theme === 'violet' ? '#FFFFFF' : '#232323';
  const cardTextColor = theme === 'light' ? '#232323' : theme === 'violet' ? '#232323' : '#fff';
  const cardSubTextColor =
    theme === 'light' ? '#8B8B8B' : theme === 'violet' ? '#8B8B8B' : '#bdbdbd';
  const cardBorderColor =
    theme === 'light' ? '#E8E8E8' : theme === 'violet' ? '#E8E8E8' : '#393939';

  // İkon renkleri - light ve violet temada gri, dark temada beyaz
  const iconFilter =
    theme === 'dark'
      ? 'none'
      : 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(100%)';

  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div style={{ fontWeight: 600, fontSize: 16 }}>{task.title}</div>
        {task.description && (
          <div
            style={{
              color: cardSubTextColor,
              fontSize: 14,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4em',
              maxHeight: '2.8em',
            }}
          >
            {task.description}
          </div>
        )}
        <hr
          style={{
            border: 'none',
            borderTop: `1px solid ${cardBorderColor}`,
            margin: '10px 0 6px 0',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 0 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minWidth: 60,
            }}
          >
            <span
              style={{ color: cardSubTextColor, fontSize: 12, fontWeight: 400, marginBottom: 2 }}
            >
              Priority
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: priorityColors[task.priority] || '#5C5C5C',
                  display: 'inline-block',
                }}
              ></span>
              <span
                style={{
                  color: priorityColors[task.priority] || '#5C5C5C',
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                {task.priority}
              </span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minWidth: 90,
            }}
          >
            <span
              style={{ color: cardSubTextColor, fontSize: 12, fontWeight: 400, marginBottom: 2 }}
            >
              Deadline
            </span>
            <span style={{ color: cardTextColor, fontSize: 13, fontWeight: 500 }}>
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : ''}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {showBell && (
              <img src={bell} alt='bell' style={{ width: 18, height: 18, cursor: 'pointer' }} />
            )}
            <img
              src={arrowRight}
              alt='move'
              style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7, filter: iconFilter }}
              onClick={() => onMove && onMove(task, columnId)}
            />
            <img
              src={pencil}
              alt='edit'
              style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7, filter: iconFilter }}
              onClick={() => onEdit && onEdit(task, columnId)}
            />
            <img
              src={trash}
              alt='delete'
              style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7, filter: iconFilter }}
              onClick={() => onDelete && onDelete(task, columnId)}
            />
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

const BoardDetail = ({ board, theme }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const isLoading = useSelector(selectIsLoading);
  const tasksByColumn = useSelector((state) => state.task.tasksByColumn);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editColumn, setEditColumn] = useState(null); // { columnId, title }
  const [deleteColumn, setDeleteColumn] = useState(null); // { columnId, title }
  const [addCardModal, setAddCardModal] = useState({ open: false, columnId: null });
  const [editCardModal, setEditCardModal] = useState({ open: false, card: null, columnId: null });
  const [deleteCardModal, setDeleteCardModal] = useState({
    open: false,
    card: null,
    columnId: null,
  });
  const [moveCardModal, setMoveCardModal] = useState({
    open: false,
    card: null,
    fromColumnId: null,
  });
  const [columnOrder, setColumnOrder] = useState([]);
  const [tasksOrder, setTasksOrder] = useState({});
  const [activeId, setActiveId] = useState(null);

  const bgObj = backgroundTypes.find((bg) => bg.name === board.background);
  const bgImg = bgObj ? bgObj.img : undefined;

  // Board background'ına göre text rengini belirle
  const textColor = getTextColorByBackground(board.background || '', theme);

  // Tema renklerine göre column arkaplanı
  const columnBg = theme === 'light' ? '#FFFFFF' : theme === 'violet' ? '#FFFFFF' : '#121212';
  const columnTextColor =
    theme === 'light' ? '#232323' : theme === 'violet' ? '#232323' : '#FFFFFF';

  // Column ikonları için filter
  const columnIconFilter =
    theme === 'dark'
      ? 'none'
      : 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(100%)';

  useEffect(() => {
    if (board?._id) {
      dispatch(fetchColumnsThunk(board._id));
    }
  }, [board?._id, dispatch]);

  useEffect(() => {
    if (Array.isArray(columns)) {
      columns.forEach((col) => {
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
    await dispatch(
      deleteTaskThunk({
        boardId: board._id,
        columnId: deleteCardModal.columnId,
        taskId: deleteCardModal.card._id,
      })
    );
    setDeleteCardModal({ open: false, card: null, columnId: null });
  };

  const handleEditCardSave = async (values) => {
    if (!values._id) return;
    await dispatch(
      updateTaskThunk({
        boardId: board._id,
        columnId: editCardModal.columnId,
        taskId: values._id,
        title: values.title,
        description: values.desc,
        priority: values.label,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
      })
    );
    setEditCardModal({ open: false, card: null, columnId: null });
  };

  const handleMoveCard = (card, fromColumnId) => {
    setMoveCardModal({ open: true, card, fromColumnId });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', minHeight: 400 }}>
          {columnOrder.map((columnId) => {
            const column = columns.find((col) => col._id === columnId);
            if (!column) return null;
            return (
              <SortableColumn key={column._id} id={column._id}>
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
                  }}
                >
                  <span style={{ color: columnTextColor }}>{column.title}</span>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <img
                      style={{ cursor: 'pointer', filter: columnIconFilter }}
                      src={pencil}
                      alt='pencil'
                      onClick={() => setEditColumn({ columnId: column._id, title: column.title })}
                    />
                    <img
                      style={{ cursor: 'pointer', filter: columnIconFilter }}
                      src={trash}
                      alt='trash'
                      onClick={() => setDeleteColumn({ columnId: column._id, title: column.title })}
                    />
                  </div>
                </div>
                <SortableContext
                  items={tasksOrder[column._id] || []}
                  strategy={verticalListSortingStrategy}
                >
                  <div style={{ minWidth: 320, maxWidth: 340 }}>
                    {(tasksOrder[column._id] || []).map((taskId) => {
                      const task = (tasksByColumn[column._id] || []).find((t) => t._id === taskId);
                      if (!task) return null;
                      return (
                        <SortableCard key={task._id} id={task._id}>
                          <TaskCard task={task} columnId={column._id} theme={theme} />
                        </SortableCard>
                      );
                    })}
                  </div>
                </SortableContext>
                <div
                  style={{
                    width: '100%',
                    marginTop: 16,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    flex: 1,
                  }}
                >
                  <button
                    style={{
                      width: '100%',
                      padding: '16px 0',
                      borderRadius: 8,
                      background: theme === 'violet' ? '#5255BC' : '#bedbb0',
                      color: theme === 'violet' ? '#FFFFFF' : '#151515',
                      border: 'none',
                      fontWeight: 500,
                      fontSize: 16,
                      marginTop: 8,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                    onClick={() => setAddCardModal({ open: true, columnId: column._id })}
                  >
                    + Add another card
                  </button>
                </div>
              </SortableColumn>
            );
          })}
        </div>
      </SortableContext>
      {/* AddCardModal'ı her column için render et */}
      {addCardModal.open && (
        <AddCardModal
          open={addCardModal.open}
          onClose={() => setAddCardModal({ open: false, columnId: null })}
          onAdd={async ({ title, desc, label, deadline }) => {
            await dispatch(
              addTaskThunk({
                boardId: board._id,
                columnId: addCardModal.columnId,
                title,
                description: desc,
                priority: label,
                deadline: deadline ? deadline.toISOString() : undefined,
              })
            );
            dispatch(fetchTasksThunk({ boardId: board._id, columnId: addCardModal.columnId }));
          }}
          columnId={addCardModal.columnId}
          boardId={board._id}
        />
      )}
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
  );
};

// MoveCardModal component
function MoveCardModal({ open, card, fromColumnId, columns, onClose, boardId }) {
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
    await dispatch(
      require('../redux/column/taskOperations').moveTaskThunk({
        boardId,
        fromColumnId,
        toColumnId: selectedColumn,
        taskId: card._id,
      })
    );
    setSaving(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ minWidth: 340 }}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalTitle} style={{ marginBottom: 18 }}>
          Move card
        </div>
        <form onSubmit={handleMove}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#fff', fontSize: 15, marginBottom: 6, display: 'block' }}>
              Select column
            </label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: '1.5px solid #bedbb0',
                background: '#232323',
                color: '#fff',
                fontSize: 16,
              }}
            >
              {columns.map((col) => (
                <option key={col._id} value={col._id} disabled={col._id === fromColumnId}>
                  {col.title} {col._id === fromColumnId ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            className={styles.sendBtn}
            type='submit'
            disabled={saving || selectedColumn === fromColumnId}
            style={{ width: '100%', marginTop: 8 }}
          >
            {saving ? 'Moving...' : 'Move'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BoardDetail;
