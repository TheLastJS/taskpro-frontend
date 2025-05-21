import React from "react";
import styles from "./WelcomePage.module.css";
import { NavLink } from "react-router-dom";
import welcomeImage from "../../assets/welcome-image.png";
import icon from "../../assets/icon.svg";

function WelcomePage() {
  return (
    <div className={styles.backgroundLinear}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <img
            src={welcomeImage}
            alt="welcome-image"
            width="162"
            height="162"
          />
          <div className={styles.logo}>
            <img src={icon} alt="icon" />
            <p>Task Pro</p>
          </div>
          <p className={styles.welcomeText}>
            Supercharge your productivity and take control of your tasks with
            Task Pro - Don't wait, start achieving your goals now!
          </p>
        </div>

        <div className={styles.button}>
          <NavLink to="/register">
            <button className={styles.buttonRegister}>
              <p>Registration</p>
            </button>
          </NavLink>
          <NavLink to="/login">
            <button className={styles.buttonLogin}>Log In</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
