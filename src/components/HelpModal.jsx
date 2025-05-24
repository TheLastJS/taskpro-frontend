import React, { useState, useEffect } from "react";
import styled, { useTheme } from 'styled-components';
import { useSelector } from "react-redux";
import axios from "../redux/axiosInstance";

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
  border: 1px solid ${({ theme }) => {
    if (theme.mode === 'violet') return '#7B7EDE';
    return theme.inputBorder;
  }};
  border-radius: 8px;
  width: 100%;
  height: 49px;
  font-weight: 400;
  font-size: 14px;
  background: ${({ theme }) => {
    if (theme.mode === 'violet') return '#FCFCFC';
    return theme.inputBg;
  }};
  color: ${({ theme }) => {
    if (theme.mode === 'violet') return '#161616';
    return theme.inputText;
  }};
  padding: 0 18px;
  transition: border 0.2s;
  box-sizing: border-box;
  
  &::placeholder {
    color: ${({ theme }) => {
      if (theme.mode === 'violet') return '#757575';
      return theme.mode === 'light' ? '#8FA5B2' : '#FFFFFF4D';
    }};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => {
      if (theme.mode === 'violet') return '#7B7EDE';
      return theme.accent;
    }};
  }

  &:disabled, &[readonly] {
    background: #f3f3f3 !important;
    color: #bdbdbd !important;
    cursor: not-allowed;
    opacity: 1;
  }
`;

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => {
    if (theme.mode === 'violet') return '#7B7EDE';
    return theme.inputBorder;
  }};
  border-radius: 8px;
  width: 100%;
  min-height: 80px;
  font-weight: 400;
  font-size: 14px;
  background: ${({ theme }) => {
    if (theme.mode === 'violet') return '#FCFCFC';
    return theme.inputBg;
  }};
  color: ${({ theme }) => {
    if (theme.mode === 'violet') return '#161616';
    return theme.inputText;
  }};
  padding: 14px 18px;
  transition: border 0.2s;
  box-sizing: border-box;
  resize: none;
  font-family: inherit;
  
  &::placeholder {
    color: ${({ theme }) => {
      if (theme.mode === 'violet') return '#757575';
      return theme.mode === 'light' ? '#8FA5B2' : '#FFFFFF4D';
    }};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => {
      if (theme.mode === 'violet') return '#7B7EDE';
      return theme.accent;
    }};
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
  background: ${({ theme }) => theme.mode === 'violet' ? '#5255BC' : theme.accent};
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

const HelpModal = ({ onClose }) => {
  const user = useSelector(state => state.auth.user);
  const [form, setForm] = useState({ email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Kullanıcı login ise e-maili otomatik doldur
  useEffect(() => {
    if (user && user.email) {
      setForm(f => ({ ...f, email: user.email }));
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "message") setTouched(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/help", {
        email: form.email,
        message: form.message
      });
      setLoading(false);
      setForm({ email: "", message: "" });
      onClose();
      // Başarı mesajı eklenebilir (örn. toast)
    } catch (err) {
      setLoading(false);
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>Need help</ModalTitle>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="off"
            disabled={!!(user && user.email)}
            readOnly={!!(user && user.email)}
          />
          <TextArea
            name="message"
            placeholder="Enter your message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            required
            autoComplete="off"
            autoFocus
          />
          {touched && form.message.length > 0 && form.message.length < 10 && (
            <span style={{ color: '#ff6b6b', fontSize: 13, marginTop: -10, marginBottom: 2 }}>
              Please enter at least 10 characters.
            </span>
          )}
          <SubmitButton type="submit" disabled={loading || form.message.length < 10}>
            {loading ? "Sending..." : "Send"}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HelpModal;