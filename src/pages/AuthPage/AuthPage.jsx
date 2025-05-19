import React from "react";
import { useParams, Navigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

function AuthPage() {
  const { type } = useParams();

  if (type === "login") return <LoginForm />;
  if (type === "register") return <RegisterForm />;
  // Geçersiz type için ana sayfaya yönlendir
  return <Navigate to="/" />;
}

export default AuthPage;
