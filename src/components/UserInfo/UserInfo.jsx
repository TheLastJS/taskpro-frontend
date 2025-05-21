import React, { useState, useEffect } from "react";
import styles from "./UserInfo.module.css";
import axios from "../../redux/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { setUser } from "../../redux/auth/authSlice";
import { logoutThunk } from "../../redux/auth/authOperations";

const UserInfo = ({ onClose }) => {
  const [user, setUserState] = useState({ name: "", email: "", avatar: "" });
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("/users/current", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserState(res.data.data);
        setForm({ name: res.data.data.name, email: res.data.data.email, password: "" });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert("Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.");
          dispatch(logoutThunk());
          if (onClose) onClose();
        } else {
          alert("Profil bilgileri alınırken bir hata oluştu.");
        }
      });
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = e => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handlePasswordToggle = () => setShowPassword(v => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (avatarRemoved && !avatarFile && user.avatar) {
        formData.append("avatar", "");
      }
      if (form.password) {
        formData.append("password", form.password);
      }
      await axios.patch(`/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Kullanıcıyı tekrar çek
      const res = await axios.get("/users/current", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserState(res.data.data);
      dispatch(setUser(res.data.data));
      setAvatarFile(null);
      setAvatarRemoved(false);
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  // Avatar önizleme: avatarRemoved true ise hiçbir şey gösterme
  let avatarPreview = null;
  if (!avatarRemoved) {
    if (avatarFile) {
      avatarPreview = URL.createObjectURL(avatarFile);
    } else if (user.avatar) {
      avatarPreview = user.avatar;
    }
  }

  // Avatarı kaldırma fonksiyonu (sadece localde kaldır)
  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarRemoved(true);
  };

  // Modal kapatılırsa avatarRemoved'u sıfırla
  useEffect(() => {
    if (!onClose) return;
    return () => setAvatarRemoved(false);
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.modalTitle}>Edit Profile</div>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarIcon}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#232323"/><path d="M24 25.5C27.0376 25.5 29.5 23.0376 29.5 20C29.5 16.9624 27.0376 14.5 24 14.5C20.9624 14.5 18.5 16.9624 18.5 20C18.5 23.0376 20.9624 25.5 24 25.5Z" fill="#bdbdbd"/><path d="M12 36.5C12 31.8056 17.3726 28 24 28C30.6274 28 36 31.8056 36 36.5" fill="#bdbdbd"/></svg>
            )}
            {avatarPreview ? (
              <button type="button" className={styles.avatarAddBtn} onClick={handleRemoveAvatar} title="Remove avatar">-</button>
            ) : (
              <label className={styles.avatarAddBtn}>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                +
              </label>
            )}
          </div>
        </div>
        <form className={styles.formArea} onSubmit={handleSubmit} autoComplete="off">
          <input
            className={styles.inputArea}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            autoComplete="off"
            autoFocus
          />
          <input
            className={styles.inputArea}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E-mail"
            autoComplete="off"
            disabled
            readOnly
            style={{ background: '#232323', color: '#bdbdbd', cursor: 'not-allowed' }}
          />
          <div className={styles.passwordWrapper}>
            <input
              className={styles.inputArea}
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="off"
            />
            <span onClick={handlePasswordToggle} className={styles.eyeIcon}>
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>
          <button className={styles.sendBtn} type="submit" disabled={loading}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo; 