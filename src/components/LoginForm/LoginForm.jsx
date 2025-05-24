import { ErrorMessage, Field, Formik } from "formik";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { userLoginSchema } from "../../schemas/userLoginSchema";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../redux/auth/authOperations";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.background}>
      <div className={styles.registerForm}>
        <div className={styles.navigate}>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? styles.activeTab : styles.inactiveTab
            }
          >
            <p>Registration</p>
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? styles.activeTab : styles.inactiveTab
            }
          >
            <p>Log In</p>
          </NavLink>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={userLoginSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await dispatch(loginThunk(values)).unwrap();
              navigate("/home");
            } catch (err) {
              alert("Giriş başarısız: " + (err.message || "Hata"));
            }
            resetForm();
          }}
        >
          {({ handleSubmit }) => (
            <form className={styles.formArea} onSubmit={handleSubmit}>
              <ErrorMessage
                name="email"
                component="div"
                className={styles.errorMessage}
              />
              <Field
                className={styles.inputArea}
                type="email"
                name="email"
                placeholder="Enter your email"
                autoFocus
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.errorMessage}
              />
              <Field name="password">
                {({ field }) => (
                  <div className={styles.passwordWrapper}>
                    <input
                      {...field}
                      className={styles.inputArea}
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm a password"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </span>
                  </div>
                )}
              </Field>

              <button className={styles.submitBtn} type="submit">
                Log In Now
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginForm;
