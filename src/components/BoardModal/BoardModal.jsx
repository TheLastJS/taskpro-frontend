import React, { useState } from "react";
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className={styles.title}>New board</div>
        <div className={styles.label}>Title</div>
        <input
          className={styles.input}
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
        <div className={styles.label}>Icons</div>
        <div className={styles.iconRow}>
          {ICONS.map((icon) => (
            <button
              key={icon.id}
              className={
                styles.iconButton +
                (selectedIcon === icon.id ? " " + styles.selected : "")
              }
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
        <button className={styles.createBtn} onClick={handleCreate}>
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
