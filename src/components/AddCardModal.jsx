import React, { useEffect, useState, useRef } from "react";
import styled, { useTheme } from 'styled-components';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const LABELS = [
  { color: "#8FA1D0", name: "Low" },
  { color: "#E09CB5", name: "Medium" },
  { color: "#BEDBB0", name: "High" },
  { color: "#5C5C5C", name: "Without" },
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
  z-index: 3000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 32px 32px 28px 32px;
  min-width: 370px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: ${({ theme }) => theme.mode === 'light' ? `1px solid #E8E8E8` : 'none'};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 28px;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  
  span:first-child {
    margin-bottom: 18px;
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 2px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $hasError }) => $hasError ? '#ff6b6b' : theme.inputBorder};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.inputText};
  font-size: 14px;
  box-sizing: border-box;
  &::placeholder {
    color: ${({ theme }) => theme.mode === 'light' ? '#8FA5B2' : theme.mode === 'violet' ? '#8FA5B2' : '#FFFFFF4D'};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  width: 100%;
  min-height: 80px;
  font-weight: 400;
  font-size: 14px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.inputText};
  padding: 14px 18px;
  transition: border 0.2s;
  box-sizing: border-box;
  resize: none;
  font-family: inherit;
  
  &::placeholder {
    color: ${({ theme }) => theme.mode === 'light' ? '#8FA5B2' : 
            theme.mode === 'violet' ? '#8FA5B2' : '#FFFFFF4D'};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

const LabelSection = styled.div`
  margin: 8px 0 0 0;
  width: 100%;
`;

const LabelTitle = styled.div`
  margin-bottom: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const LabelContainer = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;

const LabelOption = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
  
  input {
    opacity: 0;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 0;
    left: 0;
    top: 0;
    z-index: 2;
    cursor: pointer;
  }
  
  span {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    border: ${({ $isSelected, theme }) => 
      $isSelected 
        ? `2px solid ${theme.mode === 'light' || theme.mode === 'violet' ? '#333' : '#fff'}` 
        : `2px solid ${theme.mode === 'light' || theme.mode === 'violet' ? '#E8E8E8' : '#232323'}`};
    box-sizing: border-box;
    z-index: 1;
  }
`;

const DeadlineSection = styled.div`
  margin: 12px 0 0 0;
  width: 100%;
`;

const DeadlineTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const SubmitButton = styled.button`
  border-radius: 8px;
  width: 100%;
  height: 49px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.mode === 'violet' ? '#FFFFFF' : '#161616'};
  background: ${({ theme }) => theme.accent};
  border: none;
  margin-top: 18px;
  transition: opacity 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

function AddCardModal({ open, onClose, onAdd, columnId, boardId, initialValues = {}, editMode = false }) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [desc, setDesc] = useState(initialValues.description || "");
  const [label, setLabel] = useState(initialValues.priority || "Without");
  const [deadline, setDeadline] = useState(initialValues.deadline ? dayjs(initialValues.deadline) : dayjs());
  const [showCalendar, setShowCalendar] = useState(false);
  const [touched, setTouched] = useState(false);
  const modalRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setTitle(initialValues.title || "");
      setDesc(initialValues.description || "");
      setLabel(initialValues.priority || "Without");
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
    onAdd && onAdd({
      title,
      desc,
      label,
      deadline,
      columnId,
      _id: initialValues._id,
    });
    onClose();
  };

  const datePickerStyles = {
    background: theme.inputBg,
    color: theme.inputText,
    border: `1px solid ${theme.inputBorder}`,
    borderRadius: '8px',
    '& input': { 
      color: theme.inputText, 
      fontWeight: 600, 
      fontSize: 16, 
      textAlign: 'left' 
    },
    '& fieldset': { border: 'none' },
    width: '100%',
  };

  const datePickerPopperStyles = {
    zIndex: 4000,
    '& .MuiPaper-root': {
      background: theme.card,
      color: theme.text,
      borderRadius: '12px',
      border: theme.mode === 'light' ? '1px solid #E8E8E8' : 'none',
    },
    '& .MuiPickersDay-root': {
      color: theme.text,
      background: 'transparent',
      borderRadius: '50%',
      '&:hover': {
        background: theme.accent,
        color: theme.mode === 'violet' ? '#FFFFFF' : '#161616',
      },
    },
    '& .Mui-selected': {
      background: `${theme.accent} !important`,
      color: `${theme.mode === 'violet' ? '#FFFFFF' : '#161616'} !important`,
    },
    '& .MuiPickersDay-today': {
      border: `1px solid ${theme.accent}`,
    },
    '& .MuiPickersCalendarHeader-label': {
      color: theme.text,
    },
    '& .MuiPickersCalendarHeader-switchViewButton': {
      color: theme.accent,
    },
    '& .MuiIconButton-root': {
      color: theme.accent,
    },
    '& .MuiPickersYear-yearButton': {
      color: theme.text,
      '&.Mui-selected': {
        background: theme.accent,
        color: theme.mode === 'violet' ? '#FFFFFF' : '#161616',
      },
    },
    '& .MuiPickersMonth-monthButton': {
      color: theme.text,
      '&.Mui-selected': {
        background: theme.accent,
        color: theme.mode === 'violet' ? '#FFFFFF' : '#161616',
      },
    },
    '& .MuiDayCalendar-weekDayLabel': {
      color: theme.text,
      fontWeight: 500,
    },
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} ref={modalRef}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>
          <span>{editMode ? 'Edit card' : 'Add card'}</span>
          {touched && !title.trim() && (
            <ErrorMessage>Please fill the title field</ErrorMessage>
          )}
        </ModalTitle>
        <Form onSubmit={handleAdd} autoComplete="off">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            autoFocus
            $hasError={touched && !title.trim()}
          />
          <TextArea
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
          />
          <LabelSection>
            <LabelTitle>Label color</LabelTitle>
            <LabelContainer>
              {LABELS.map(l => (
                <LabelOption key={l.name} $isSelected={label === l.name}>
                  <input
                    type="radio"
                    name="label"
                    value={l.name}
                    checked={label === l.name}
                    onChange={() => setLabel(l.name)}
                  />
                  <span style={{ background: l.color }}></span>
                </LabelOption>
              ))}
            </LabelContainer>
          </LabelSection>
          <DeadlineSection>
            <DeadlineTitle>Deadline</DeadlineTitle>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <DatePicker
                value={deadline}
                onChange={val => setDeadline(val)}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: datePickerStyles,
                    InputProps: {
                      style: { color: theme.inputText },
                    },
                  },
                  openPickerButton: {
                    sx: {
                      color: theme.accent,
                    },
                  },
                  popper: {
                    sx: datePickerPopperStyles,
                  },
                }}
              />
            </LocalizationProvider>
          </DeadlineSection>
          <SubmitButton type="submit">
            {editMode ? 'Edit' : (
              <>
                <span style={{ fontSize: 20, marginRight: 4 }}>+</span> 
                Add
              </>
            )}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddCardModal;