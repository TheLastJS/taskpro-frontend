// ColumnModal.jsx
import React, { useState } from "react";
import styles from "../components/UserInfo/UserInfo.module.css";

const ColumnModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onSubmit(title);
    setLoading(false);
    setTitle("");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalTitle} style={{ marginBottom: 24 }}>
          Add new column
        </div>
        <form
          className={styles.formArea}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            className={styles.inputArea}
            type="text"
            name="title"
            placeholder="Column title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <button className={styles.sendBtn} type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Column"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ColumnModal;
