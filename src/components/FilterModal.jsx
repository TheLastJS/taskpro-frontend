import React from "react";
import styled, { useTheme } from 'styled-components';

const PRIORITY_COLORS = [
  { name: 'Without priority', color: '#5C5C5C', value: 'Without' },
  { name: 'Low', color: '#8FA1D0', value: 'Low' },
  { name: 'Medium', color: '#E09CB5', value: 'Medium' },
  { name: 'High', color: '#BEDBB0', value: 'High' },
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
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
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
`;

const SectionContainer = styled.div`
  margin-bottom: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ShowAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.mode === 'light' ? '#8FA5B2' : 
          theme.mode === 'violet' ? '#8FA5B2' : '#FFFFFF80'};
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`;

const PriorityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PriorityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'light' || theme.mode === 'violet' ? 
      '#F4F4F4' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const PriorityDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  opacity: ${({ isSelected }) => isSelected ? 1 : 0.5};
  transition: opacity 0.2s;
`;

const PriorityLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  opacity: ${({ isSelected }) => isSelected ? 1 : 0.7};
  transition: opacity 0.2s;
`;

const FilterModal = ({ open, onClose, selectedFilters, onFilterChange }) => {
  if (!open) return null;

  const handlePriorityClick = (priority) => {
    // Filtre seçildiğinde hemen filtre uygulansın ve modal kapansın
    onFilterChange([priority]);
    onClose();
  };

  const handleShowAll = () => {
    // Clear filter butonuna tıklayınca filtreleri temizle ve modal kapansın
    onFilterChange([]);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          &times;
        </CloseButton>
        
        <ModalTitle>Filters</ModalTitle>
        
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Label color</SectionTitle>
            <ShowAllButton onClick={handleShowAll}>
              Show all
            </ShowAllButton>
          </SectionHeader>
          
          <PriorityList>
            {PRIORITY_COLORS.map((priority) => (
              <PriorityItem
                key={priority.value}
                onClick={() => handlePriorityClick(priority.value)}
              >
                <PriorityDot
                  color={priority.color}
                  isSelected={selectedFilters.includes(priority.value)}
                />
                <PriorityLabel
                  isSelected={selectedFilters.includes(priority.value)}
                >
                  {priority.name}
                </PriorityLabel>
              </PriorityItem>
            ))}
          </PriorityList>
        </SectionContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FilterModal;