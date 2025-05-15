import React, { useState } from "react";
import styles from "./RegisterForm.module.css";
import { NavLink } from "react-router-dom";
import { ErrorMessage, Field, Formik } from "formik";
import { userRegisterSchema } from "../../schemas/userRegisterSchema";
import { FiEye, FiEyeOff } from "react-icons/fi";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className={styles.background}>
      <div className={styles.registerForm}>
        <div className={styles.navigate}>
          <NavLink
            to="/auth/register"
            className={({ isActive }) =>
              isActive ? styles.activeTab : styles.inactiveTab
            }
          >
            <p>Registration</p>
          </NavLink>
          <NavLink
            to="/auth/login"
            className={({ isActive }) =>
              isActive ? styles.activeTab : styles.inactiveTab
            }
          >
            <p>Log In</p>
          </NavLink>
        </div>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={userRegisterSchema}
          onSubmit={(values, { resetForm }) => {
            console.log("Form values:", values);
            resetForm();
          }}
        >
          {({ handleSubmit }) => (
            <form className={styles.formArea} onSubmit={handleSubmit}>
              <ErrorMessage
                name="name"
                component="div"
                className={styles.errorMessage}
              />
              <Field
                className={styles.inputArea}
                type="name"
                name="name"
                placeholder="Enter your name"
              />
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
                      placeholder="Create a password"
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
                Register Now
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterForm;
