import React, { useState } from "react";
import styled, { useTheme } from 'styled-components';

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
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  width: 100%;
  height: 49px;
  font-weight: 400;
  font-size: 14px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.inputText};
  padding: 0 18px;
  transition: border 0.2s;
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
  margin-top: 10px;
  transition: opacity 0.2s;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const EditColumnModal = ({ currentTitle, onClose, onSubmit }) => {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onSubmit(title);
    setLoading(false);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          &times;
        </CloseButton>
        <ModalTitle>
          Edit column
        </ModalTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <SubmitButton type="submit" disabled={loading}>
            <span style={{fontSize: 18, marginRight: 8}}>+</span>
            {loading ? "Updating..." : "Add"}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditColumnModal;