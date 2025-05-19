import React, { useState } from "react";
import styles from "../components/UserInfo/UserInfo.module.css";
import helpImage from "../assets/help-image.png";

const HelpModal = ({ onClose }) => {
  const [form, setForm] = useState({ email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    // Burada backend'e gönderme işlemi yapılabilir
    setTimeout(() => {
      setLoading(false);
      setForm({ email: "", message: "" });
      onClose();
      // Başarı mesajı eklenebilir
    }, 1000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.modalTitle} style={{ marginBottom: 24 }}>Need help</div>
        <form className={styles.formArea} onSubmit={handleSubmit} autoComplete="off">
          <input
            className={styles.inputArea}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
            autoComplete="off"
          />
          <textarea
            className={styles.inputArea}
            name="message"
            placeholder="Enter your message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            style={{ resize: "none", minHeight: 80 }}
            required
            autoComplete="off"
          />
          <button className={styles.sendBtn} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpModal; 