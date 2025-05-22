import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBoardThunk, updateBoardThunk } from '../redux/board/boardOperations';
import { selectBoardsLoading } from '../redux/board/boardSelectors';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ICONLAR
import starIcon from '../assets/icons/star-04.svg';
import loadingIcon from '../assets/icons/loading-03.svg';
import puzzleIcon from '../assets/icons/puzzle-piece-02.svg';
import containerIcon from '../assets/icons/container.svg';
import lightbulbIcon from '../assets/icons/lightning-02.svg';
import colorsIcon from '../assets/icons/colors.svg';
import hexagonIcon from '../assets/icons/hexagon-01.svg';
// BACKGROUNDS
import bg1 from '../assets/backgrounds/desktop-images/desktop-1.png';
import bg2 from '../assets/backgrounds/desktop-images/desktop-2.png';
import bg3 from '../assets/backgrounds/desktop-images/desktop-3.png';
import bg4 from '../assets/backgrounds/desktop-images/desktop-4.png';
import bg5 from '../assets/backgrounds/desktop-images/desktop-5.png';
import bg6 from '../assets/backgrounds/desktop-images/desktop-6.png';
import bg7 from '../assets/backgrounds/desktop-images/dektop-7.png';
import bg8 from '../assets/backgrounds/desktop-images/desktop-8.png';
import bg9 from '../assets/backgrounds/desktop-images/desktop-9.png';
import bg10 from '../assets/backgrounds/desktop-images/desktop-10.png';
import bg11 from '../assets/backgrounds/desktop-images/desktop-11.png';
import bg12 from '../assets/backgrounds/desktop-images/dekstop-12.png';
import bg13 from '../assets/backgrounds/desktop-images/desktop-13.png';
import bg14 from '../assets/backgrounds/desktop-images/desktop-14.png';
import bg15 from '../assets/backgrounds/desktop-images/desktop-15.png';

const iconTypes = [
  { name: 'icon-star', icon: starIcon },
  { name: 'icon-loading', icon: loadingIcon },
  { name: 'icon-puzzle-piece', icon: puzzleIcon },
  { name: 'icon-container', icon: containerIcon },
  { name: 'icon-light-bulb', icon: lightbulbIcon },
  { name: 'icon-colors', icon: colorsIcon },
  { name: 'icon-hexagon', icon: hexagonIcon },
];
export const backgroundTypes = [
  { name: '', img: null },
  { name: '00', img: bg1 },
  { name: '01', img: bg2 },
  { name: '02', img: bg3 },
  { name: '03', img: bg4 },
  { name: '04', img: bg5 },
  { name: '05', img: bg6 },
  { name: '06', img: bg7 },
  { name: '07', img: bg8 },
  { name: '08', img: bg9 },
  { name: '09', img: bg10 },
  { name: '10', img: bg11 },
  { name: '11', img: bg12 },
  { name: '12', img: bg13 },
  { name: '13', img: bg14 },
  { name: '14', img: bg15 },
];

const BoardModal = ({ open, onClose, editBoard = false, initialBoard = null }) => {
  const [title, setTitle] = useState(initialBoard?.title || '');
  const [icon, setIcon] = useState(initialBoard?.icon || iconTypes[0].name);
  const [background, setBackground] = useState(initialBoard?.background || backgroundTypes[0].name);
  const dispatch = useDispatch();
  const loading = useSelector(selectBoardsLoading);

  useEffect(() => {
    if (open && initialBoard) {
      setTitle(initialBoard.title || '');
      setIcon(initialBoard.icon || iconTypes[0].name);
      setBackground(initialBoard.background || backgroundTypes[0].name);
    } else if (open && !initialBoard) {
      setTitle('');
      setIcon(iconTypes[0].name);
      setBackground(backgroundTypes[0].name);
    }
  }, [open, initialBoard]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editBoard && initialBoard) {
      await dispatch(updateBoardThunk({
        id: initialBoard._id,
        title,
        icon,
        background,
      }));
      if (onClose) onClose();
    } else {
      const boardData = { title, icon };
      if (background !== '') boardData.background = background;
      try {
        const result = await dispatch(createBoardThunk(boardData)).unwrap();
        if (result && onClose) onClose();
        setTitle('');
        setIcon(iconTypes[0].name);
        setBackground(backgroundTypes[0].name);
      } catch (err) {
        console.log('Board create error:', err?.message);
        if (err?.message && err.message.toLowerCase().includes('already exists')) {
          toast.error('Board name is already existed');
        } else {
          toast.error(err?.message || 'Board could not be created!');
        }
      }
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#181818', padding: 32, borderRadius: 8, minWidth: 340, color: '#fff' }}>
        <h3 style={{ marginBottom: 16 }}>{editBoard ? 'Edit board' : 'New board'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #333', background: '#232323', color: '#fff' }}
            autoFocus
          />
          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4 }}>Icons</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {iconTypes.map(i => (
                <span
                  key={i.name}
                  onClick={() => setIcon(i.name)}
                  style={{
                    fontSize: 22,
                    padding: 4,
                    borderRadius: 4,
                    background: icon === i.name ? '#bedbb0' : 'transparent',
                    color: icon === i.name ? '#232323' : '#fff',
                    cursor: 'pointer',
                    border: icon === i.name ? '2px solid #bedbb0' : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src={i.icon} alt={i.name} style={{ width: 24, height: 24 }} />
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 4 }}>Background</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', marginBottom: 8 }}>
              {backgroundTypes.slice(0, 8).map(bg => (
                bg.img ? (
                  <img
                    key={bg.name || 'none'}
                    src={bg.img}
                    alt={bg.name}
                    onClick={() => setBackground(bg.name)}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: background === bg.name ? '2px solid #bedbb0' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  <div
                    key="none"
                    onClick={() => setBackground('')}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      border: background === '' ? '2px solid #bedbb0' : '2px solid #444',
                      background: '#232323',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#888',
                      fontSize: 22,
                      cursor: 'pointer',
                    }}
                    title="No background"
                  >
                    <span style={{fontSize: 22}}>&times;</span>
                  </div>
                )
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
              {backgroundTypes.slice(8, 16).map(bg => (
                bg.img ? (
                  <img
                    key={bg.name}
                    src={bg.img}
                    alt={bg.name}
                    onClick={() => setBackground(bg.name)}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: background === bg.name ? '2px solid #bedbb0' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ) : null
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" disabled={loading || !title.trim()} style={{ flex: 1, padding: '10px 0', background: '#bedbb0', color: '#232323', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>
              {loading ? (editBoard ? 'Saving...' : 'Creating...') : (<><span style={{fontSize:18,marginRight:6}}>+</span> {editBoard ? 'Save' : 'Create'}</>)}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', background: '#232323', color: '#fff', border: '1px solid #444', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardModal; 