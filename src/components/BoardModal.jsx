import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBoardThunk, updateBoardThunk } from '../redux/board/boardOperations';
import { selectBoardsLoading } from '../redux/board/boardSelectors';
import { toast } from 'react-toastify';
import styled from 'styled-components';
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

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 32px;
  border-radius: 8px;
  min-width: 340px;
  color: ${({ theme }) => theme.text};
  border: ${({ theme }) => theme.mode === 'light' ? `1px solid #E8E8E8` : 'none'};
`;

const ModalTitle = styled.h3`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.inputText};
  font-size: 14px;
  box-sizing: border-box;
  
  &::placeholder {
    color: ${({ theme }) => theme.mode === 'light' ? '#8FA5B2' : 
            theme.mode === 'violet' ? '#8FA5B2' : '#FFFFFF4D'};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

const SectionLabel = styled.div`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.02em;
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const IconItem = styled.span`
  padding: 8px;
  border-radius: 6px;
  background: ${({ theme, $isSelected }) => 
    $isSelected ? theme.accent : 'transparent'};
  color: ${({ theme, $isSelected }) => 
    $isSelected ? (theme.mode === 'light' ? '#FFFFFF' : '#232323') : theme.text};
  cursor: pointer;
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.accent : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  
  &:hover {
    background: ${({ theme, $isSelected }) => 
      $isSelected ? theme.accent : (theme.mode === 'light' ? '#F4F4F4' : 
                                    theme.mode === 'violet' ? '#F4F4F4' : '#333')};
  }
  
  img {
    width: 18px;
    height: 18px;
    filter: ${({ theme, $isSelected }) => {
      if ($isSelected && (theme.mode === 'light' || theme.mode === 'violet')) {
        return 'brightness(0) invert(1)'; // Seçili: beyaz
      } else if (!$isSelected && (theme.mode === 'light' || theme.mode === 'violet')) {
        return 'brightness(0)'; // Seçili değil: siyah
      } else {
        return 'none'; // Dark tema: orijinal renk
      }
    }};
  }
`;

const BackgroundsContainer = styled.div`
  margin-bottom: 16px;
`;

const BackgroundRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  margin-bottom: 8px;
`;

const BackgroundImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.accent : 'transparent'};
  cursor: pointer;
  transition: border-color 0.2s ease;
`;

const NoBackgroundItem = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.accent : (theme.mode === 'light' || theme.mode === 'violet' ? '#E8E8E8' : '#444')};
  background: ${({ theme }) => (theme.mode === 'light' || theme.mode === 'violet') ? '#FFFFFF' : '#232323'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme.mode === 'light' || theme.mode === 'violet') ? '#888' : '#888'};
  font-size: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 24px;
`;

const CreateButton = styled.button`
  flex: 1;
  padding: 14px 0;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.mode === 'violet' ? '#FFFFFF' : '#161616'};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px 0;
  background: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.mode === 'light' || theme.mode === 'violet' ? 
    'rgba(22, 22, 22, 0.1)' : '#FFFFFF4D'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'light' || theme.mode === 'violet' ? 
      '#F4F4F4' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

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
    if (!title.trim()) {
      toast.error('Please fill the title field');
      return;
    }
    
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
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>{editBoard ? 'Edit board' : 'New board'}</ModalTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          
          <div>
            <SectionLabel>Icons</SectionLabel>
            <IconsContainer>
              {iconTypes.map(i => (
                <IconItem
                  key={i.name}
                  onClick={() => setIcon(i.name)}
                  $isSelected={icon === i.name}
                >
                  <img src={i.icon} alt={i.name} />
                </IconItem>
              ))}
            </IconsContainer>
          </div>
          
          <BackgroundsContainer>
            <SectionLabel>Background</SectionLabel>
            <BackgroundRow>
              <NoBackgroundItem
                onClick={() => setBackground('')}
                $isSelected={background === ''}
                title="No background"
              >
                ×
              </NoBackgroundItem>
              {backgroundTypes.slice(1, 8).map(bg => (
                <BackgroundImage
                  key={bg.name}
                  src={bg.img}
                  alt={bg.name}
                  onClick={() => setBackground(bg.name)}
                  $isSelected={background === bg.name}
                />
              ))}
            </BackgroundRow>
            <BackgroundRow>
              {backgroundTypes.slice(8, 16).map(bg => (
                <BackgroundImage
                  key={bg.name}
                  src={bg.img}
                  alt={bg.name}
                  onClick={() => setBackground(bg.name)}
                  $isSelected={background === bg.name}
                />
              ))}
            </BackgroundRow>
          </BackgroundsContainer>
          
          <ButtonsContainer>
            <CreateButton type="submit" disabled={loading || !title.trim()}>
              {loading ? (editBoard ? 'Saving...' : 'Creating...') : (
                <>
                  <span style={{fontSize: 18, marginRight: 8}}>+</span>
                  {editBoard ? 'Edit' : 'Create'}
                </>
              )}
            </CreateButton>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
          </ButtonsContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BoardModal;