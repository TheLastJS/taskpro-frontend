import React, { useState } from "react";
import styles from "../components/UserInfo/UserInfo.module.css";

const EditColumnModal = ({ currentTitle, onClose, onSubmit }) => {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onSubmit(title);
    setLoading(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalTitle} style={{ marginBottom: 24 }}>
          Edit column
        </div>
        <form onSubmit={handleSubmit} className={styles.formArea}>
          <input
            className={styles.inputArea}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <button className={styles.sendBtn} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Column"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditColumnModal;
