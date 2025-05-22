import React, { useEffect, useState, useRef } from "react";
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
  selectTasksByColumn,
} from "../redux/column/columnSelectors";
import { backgroundTypes } from "./BoardModal";
import ColumnModal from "./ColumnModal";
import EditColumnModal from "./EditColumnModal";
import DeleteConfirmModal from "./DeleteColumnModal.jsx";
import filter from "../assets/icons/filter.svg";
import pencil from "../assets/icons/pencil.svg";
import trash from "../assets/icons/trash.svg";
import bell from "../assets/icons/bell-01.svg";
import arrowRight from "../assets/icons/arrow-circle-broken-right.svg";
import styles from "./UserInfo/UserInfo.module.css";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';

const LABELS = [
  { color: "#8FA1D0", name: "Low" },
  { color: "#E09CB5", name: "Medium" },
  { color: "#BEDBB0", name: "High" },
  { color: "#5C5C5C", name: "Without" },
];

function AddCardModal({ open, onClose, onAdd, columnId, boardId, initialValues = {}, editMode = false }) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [desc, setDesc] = useState(initialValues.description || "");
  const [label, setLabel] = useState(initialValues.priority || "Without");
  const [deadline, setDeadline] = useState(initialValues.deadline ? dayjs(initialValues.deadline) : dayjs());
  const [showCalendar, setShowCalendar] = useState(false);
  const [touched, setTouched] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (open) {
      setTitle(initialValues.title || "");
      setDesc(initialValues.description || "");
      setLabel(initialValues.priority || "Without");
      setDeadline(initialValues.deadline ? dayjs(initialValues.deadline) : dayjs());
      setTouched(false);
      setShowCalendar(false);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!title.trim()) return;
    onAdd && onAdd({
      title,
      desc,
      label,
      deadline,
      columnId,
      _id: initialValues._id, // pass id for edit
    });
    onClose();
  };

  const todayStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} ref={modalRef} style={{ minWidth: 370, maxWidth: 400 }}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.modalTitle} style={{ marginBottom: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
          <span style={{ marginBottom: 18 }}>{editMode ? 'Edit card' : 'Add card'}</span>
          {touched && !title.trim() && (
            <span style={{ color: "#ff6b6b", fontSize: 15, fontWeight: 500, marginBottom: 10, marginTop: 2 }}>Please fill the title field</span>
          )}
        </div>
        <form className={styles.formArea} onSubmit={handleAdd} autoComplete="off" style={{ marginTop: 10 }}>
          <input
            className={styles.inputArea}
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            autoFocus
            style={touched && !title.trim() ? { border: "2px solid #ff6b6b" } : {}}
          />
          <textarea
            className={styles.inputArea}
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={{ resize: "none", minHeight: 80 }}
          />
          <div style={{ margin: "8px 0 0 0", width: "100%" }}>
            <div style={{ marginBottom: 6, fontSize: 14, color: "#fff" }}>Label color</div>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              {LABELS.map(l => (
                <label key={l.name} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", position: "relative" }}>
                  <input
                    type="radio"
                    name="label"
                    value={l.name}
                    checked={label === l.name}
                    onChange={() => setLabel(l.name)}
                    style={{ opacity: 0, position: "absolute", width: 16, height: 16, margin: 0, left: 0, top: 0, zIndex: 2, cursor: "pointer" }}
                  />
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: l.color, display: "inline-block", border: label === l.name ? "2px solid #fff" : "2px solid #232323", boxSizing: "border-box", zIndex: 1 }}></span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ margin: "12px 0 0 0", width: "100%" }}>
            <div style={{ fontSize: 14, color: "#fff", marginBottom: 4 }}>Deadline</div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <DatePicker
                value={deadline}
                onChange={val => setDeadline(val)}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: {
                      background: '#232323',
                      color: '#fff',
                      border: '1.5px solid #bedbb0',
                      borderRadius: '8px',
                      '& input': { color: '#fff', fontWeight: 600, fontSize: 16, textAlign: 'left' },
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
          <button className={styles.sendBtn} type="submit" style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {editMode ? 'Save' : (<><span style={{ fontSize: 20, marginRight: 4 }}>+</span> Add</>)}
          </button>
        </form>
      </div>
    </div>
  );
}

const TaskCard = ({ task, columnId, onEdit, onDelete, onMove }) => {
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
  return (
    <div style={{
      background: '#232323',
      borderRadius: 12,
      padding: 0,
      marginBottom: 12,
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      minHeight: 64,
    }}>
      <div style={{
        width: 8,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        background: priorityColors[task.priority] || '#5C5C5C',
        marginRight: 0,
      }} />
      <div style={{ flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{task.title}</div>
        {task.description && <div style={{ color: '#bdbdbd', fontSize: 14 }}>{task.description}</div>}
        <hr style={{ border: 'none', borderTop: '1px solid #393939', margin: '10px 0 6px 0' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 60 }}>
            <span style={{ color: '#bdbdbd', fontSize: 12, fontWeight: 400, marginBottom: 2 }}>Priority</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: priorityColors[task.priority] || '#5C5C5C', display: 'inline-block', border: '2px solid #fff' }}></span>
              <span style={{ color: priorityColors[task.priority] || '#5C5C5C', fontWeight: 500, fontSize: 13 }}>{task.priority}</span>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 90 }}>
            <span style={{ color: '#bdbdbd', fontSize: 12, fontWeight: 400, marginBottom: 2 }}>Deadline</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
              {task.deadline ? new Date(task.deadline).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {showBell && (
              <img src={bell} alt="bell" style={{ width: 18, height: 18, cursor: 'pointer' }} />
            )}
            <img src={arrowRight} alt="move" style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7 }} onClick={() => onMove && onMove(task, columnId)} />
            <img src={pencil} alt="edit" style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7 }} onClick={() => onEdit && onEdit(task, columnId)} />
            <img src={trash} alt="delete" style={{ width: 18, height: 18, cursor: 'pointer', opacity: 0.7 }} onClick={() => onDelete && onDelete(task, columnId)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BoardDetail = ({ board }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const isLoading = useSelector(selectIsLoading);
  const tasksByColumn = useSelector(state => state.task.tasksByColumn);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editColumn, setEditColumn] = useState(null); // { columnId, title }
  const [deleteColumn, setDeleteColumn] = useState(null); // { columnId, title }
  const [addCardModal, setAddCardModal] = useState({ open: false, columnId: null });
  const [editCardModal, setEditCardModal] = useState({ open: false, card: null, columnId: null });
  const [deleteCardModal, setDeleteCardModal] = useState({ open: false, card: null, columnId: null });
  const [moveCardModal, setMoveCardModal] = useState({ open: false, card: null, fromColumnId: null });

  const bgObj = backgroundTypes.find((bg) => bg.name === board.background);
  const bgImg = bgObj ? bgObj.img : undefined;

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
          <h1 style={{ color: "#fff", margin: 0 }}>{board.title}</h1>
          {columns.length === 0 && (
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
                background: "#232323",
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
              }}
            ></img>
            <h1
              style={{
                color: "#fff",
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            marginTop: 32,
            overflowX: "auto",
            overflowY: "hidden",
            height: 540,
            alignItems: "flex-start",
          }}
        >
          {columns.map((col) => {
            const tasks = tasksByColumn[col._id] || [];
            return (
              <div
                key={col._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "334px",
                  marginBottom: 16,
                  overflowX: "hidden",
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
                    background: "#121212",
                  }}
                >
                  <span style={{ color: "#fff" }}>{col.title}</span>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <img
                      style={{ cursor: "pointer" }}
                      src={pencil}
                      alt="pencil"
                      onClick={() =>
                        setEditColumn({ columnId: col._id, title: col.title })
                      }
                    />
                    <img
                      style={{ cursor: "pointer" }}
                      src={trash}
                      alt="trash"
                      onClick={() =>
                        setDeleteColumn({ columnId: col._id, title: col.title })
                      }
                    />
                  </div>
                </div>
                <div style={{ width: '100%', marginTop: 16, height: 420, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
                  <div style={{ flex: 1, overflowY: 'auto', minHeight: 20, overflowX: 'hidden' }}>
                    {tasks.length > 0 && tasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        columnId={col._id}
                        onEdit={handleEditCard}
                        onDelete={handleDeleteCard}
                        onMove={handleMoveCard}
                      />
                    ))}
                  </div>
                  <button
                    style={{
                      width: "100%",
                      padding: "16px 0",
                      borderRadius: 8,
                      background: "#bedbb0",
                      color: "#151515",
                      border: "none",
                      fontWeight: 500,
                      fontSize: 16,
                      marginTop: 8,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onClick={() => setAddCardModal({ open: true, columnId: col._id })}
                  >
                    + Add another card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
    await dispatch(require('../redux/column/taskOperations').moveTaskThunk({
      boardId,
      fromColumnId,
      toColumnId: selectedColumn,
      taskId: card._id,
    }));
    setSaving(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ minWidth: 340 }}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.modalTitle} style={{ marginBottom: 18 }}>Move card</div>
        <form onSubmit={handleMove}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#fff', fontSize: 15, marginBottom: 6, display: 'block' }}>Select column</label>
            <select
              value={selectedColumn}
              onChange={e => setSelectedColumn(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #bedbb0', background: '#232323', color: '#fff', fontSize: 16 }}
            >
              {columns.map(col => (
                <option key={col._id} value={col._id} disabled={col._id === fromColumnId}>
                  {col.title} {col._id === fromColumnId ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.sendBtn} type="submit" disabled={saving || selectedColumn === fromColumnId} style={{ width: '100%', marginTop: 8 }}>
            {saving ? 'Moving...' : 'Move'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BoardDetail;
