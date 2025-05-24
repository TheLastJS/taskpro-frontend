import React, { useState } from "react";
import { useTheme } from "styled-components";
import styles from "./BoardModal.module.css";

const ICONS = [
  { id: "icon-grid", label: "Grid" },
  { id: "icon-star", label: "Star" },
  { id: "icon-eye", label: "Eye" },
  { id: "icon-hex", label: "Hex" },
  { id: "icon-box", label: "Box" },
  { id: "icon-flash", label: "Flash" },
  { id: "icon-user", label: "User" },
  { id: "icon-cube", label: "Cube" },
];

const BoardModal = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].id);
  const [error, setError] = useState("");
  const theme = useTheme();

  if (!open) return null;

  const handleCreate = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onCreate({ title: title.trim(), icon: selectedIcon });
    setTitle("");
    setSelectedIcon(ICONS[0].id);
    onClose();
  };

  // Dynamic styles based on theme
  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  };

  const modalStyle = {
    backgroundColor: theme.card,
    color: theme.text,
    border: theme.mode === 'light' ? '1px solid #E8E8E8' : 'none'
  };

  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: theme.inputText,
    borderColor: theme.inputBorder
  };

  const createBtnStyle = {
    backgroundColor: theme.accent,
    color: theme.mode === 'light' ? '#FFFFFF' : '#232323'
  };

  const closeBtnStyle = {
    color: theme.text
  };

  const iconButtonStyle = (isSelected) => ({
    backgroundColor: isSelected ? theme.accent : 'transparent',
    color: isSelected ? (theme.mode === 'light' ? '#FFFFFF' : '#232323') : theme.text,
    borderColor: isSelected ? theme.accent : 'transparent'
  });

  return (
    <div className={styles.overlay} style={overlayStyle} onClick={onClose}>
      <div className={styles.modal} style={modalStyle} onClick={e => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          style={closeBtnStyle}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className={styles.title} style={{ color: theme.text }}>New board</div>
        <div className={styles.label} style={{ color: theme.text }}>Title</div>
        <input
          className={styles.input}
          style={inputStyle}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        {error && (
          <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 8 }}>
            {error}
          </div>
        )}
        <div className={styles.label} style={{ color: theme.text }}>Icons</div>
        <div className={styles.iconRow}>
          {ICONS.map((icon) => (
            <button
              key={icon.id}
              className={
                styles.iconButton +
                (selectedIcon === icon.id ? " " + styles.selected : "")
              }
              style={iconButtonStyle(selectedIcon === icon.id)}
              type="button"
              onClick={() => setSelectedIcon(icon.id)}
              aria-label={icon.label}
            >
              <svg width="18" height="18">
                <use xlinkHref={`#${icon.id}`} />
              </svg>
            </button>
          ))}
        </div>
        <button 
          className={styles.createBtn} 
          style={createBtnStyle}
          onClick={handleCreate}
        >
          <svg width="18" height="18" style={{ marginRight: 6 }}>
            <use xlinkHref="#icon-grid" />
          </svg>
          Create
        </button>
      </div>
    </div>
  );
};

export default BoardModal;
