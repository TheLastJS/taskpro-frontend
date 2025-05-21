import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, selectBoardsLoading, selectSelectedBoardId } from '../redux/board/boardSelectors';
import { fetchBoardsThunk, updateBoardThunk, deleteBoardThunk } from '../redux/board/boardOperations';
import { setSelectedBoard } from '../redux/board/boardSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ExtensionIcon from '@mui/icons-material/Extension';
import CategoryIcon from '@mui/icons-material/Category';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import HexagonIcon from '@mui/icons-material/Hexagon';

const iconMap = {
  'icon-project': <WorkIcon fontSize="small" />,
  'icon-star': <StarIcon fontSize="small" />,
  'icon-loading': <AutorenewIcon fontSize="small" />,
  'icon-puzzle-piece': <ExtensionIcon fontSize="small" />,
  'icon-container': <CategoryIcon fontSize="small" />,
  'icon-light-bulb': <LightbulbIcon fontSize="small" />,
  'icon-colors': <ColorLensIcon fontSize="small" />,
  'icon-hexagon': <HexagonIcon fontSize="small" />,
};

const Sidebar = ({ onCreateBoard }) => {
  const dispatch = useDispatch();
  const boards = useSelector(selectBoards);
  const loading = useSelector(selectBoardsLoading);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    dispatch(fetchBoardsThunk());
  }, [dispatch]);

  const handleEdit = (board) => {
    setEditingId(board._id);
    setEditTitle(board.title);
  };

  const handleEditChange = (e) => setEditTitle(e.target.value);

  const handleEditSave = (board) => {
    if (editTitle.trim() && editTitle !== board.title) {
      dispatch(updateBoardThunk({
        id: board._id,
        title: editTitle,
        icon: board.icon,
        background: board.background
      }));
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (board) => {
    if (window.confirm(`Delete board "${board.title}"?`)) {
      dispatch(deleteBoardThunk(board._id));
    }
  };

  return (
    <aside style={{ width: 250, background: '#232323', color: '#fff', padding: 16 }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>Boards</h2>
      <button
        style={{ width: '100%', marginBottom: 16, padding: 8, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        onClick={onCreateBoard}
      >
        + Create a new board
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {boards.map(board => (
            <li
              key={board._id}
              style={{
                padding: '8px 12px',
                marginBottom: 8,
                background: selectedBoardId === board._id ? '#333' : '#292929',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 4,
              }}
              onClick={() => dispatch(setSelectedBoard(board._id))}
            >
              <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
                {iconMap[board.icon] || <WorkIcon fontSize="small" />}
              </span>
              {editingId === board._id ? (
                <input
                  value={editTitle}
                  onChange={handleEditChange}
                  onBlur={() => handleEditSave(board)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleEditSave(board);
                    if (e.key === 'Escape') { setEditingId(null); setEditTitle(''); }
                  }}
                  autoFocus
                  style={{ flex: 1, marginRight: 8, borderRadius: 4, border: '1px solid #ccc', padding: 4 }}
                />
              ) : (
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.title}</span>
              )}
              <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
                <IconButton size="small" onClick={() => handleEdit(board)}><EditIcon fontSize="small" style={{ color: '#bedbb0' }} /></IconButton>
                <IconButton size="small" onClick={() => handleDelete(board)}><DeleteIcon fontSize="small" style={{ color: '#e57373' }} /></IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar; 