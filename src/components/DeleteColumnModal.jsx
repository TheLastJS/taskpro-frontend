import React from "react";
import styles from "../components/UserInfo/UserInfo.module.css";

const DeleteConfirmModal = ({ columnTitle, onClose, onConfirm }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalTitle} style={{ marginBottom: 24 }}>
          Are you sure ?
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 25,
          }}
        >
          <button className={styles.sureBtn} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.sureBtn} onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
