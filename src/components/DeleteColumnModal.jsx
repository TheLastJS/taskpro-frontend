import React from "react";
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
  right: 0px;
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
  text-align: center;
  width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const ConfirmButton = styled.button`
  border-radius: 8px;
  width: 100px;
  height: 49px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: #161616;
  background: ${({ theme }) => theme.accent};
  border: none;
  transition: opacity 0.2s;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  border-radius: 8px;
  width: 100px;
  height: 49px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.mode === 'light' ? 'rgba(22, 22, 22, 0.1)' : '#FFFFFF4D'};
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'light' ? '#F4F4F4' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const DeleteConfirmModal = ({ title, type = "column", onClose, onConfirm }) => {
  const theme = useTheme();

  // Silme mesajı: type 'card', 'column' veya 'board' ise uygun şekilde göster
  let message = "Are you sure?";
  if (type === "card" && title) {
    message = `Are you sure you want to delete the card \"${title}\"?`;
  } else if (type === "column" && title) {
    message = `Are you sure you want to delete the column \"${title}\"?`;
  } else if (type === "board" && title) {
    message = `Are you sure you want to delete the board \"${title}\"?`;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          &times;
        </CloseButton>
        <ModalTitle>
          {message}
        </ModalTitle>
        <ButtonsContainer>
          <ConfirmButton onClick={onConfirm}>
            Yes
          </ConfirmButton>
          <CancelButton onClick={onClose}>
            No
          </CancelButton>
        </ButtonsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;