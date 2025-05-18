import React from 'react'
import styles from "./SidebarCard.module.css"
import sidebarCardImg from "../../assets/sidebarcardimg.svg"
import helpCircle from "../../assets/help-circle.svg"

function SidebarCard() {
  return (
    <div className={styles.container}>
        <img src={sidebarCardImg} alt="SidebarCardImg" width={54} height={78}/>
        <p>If you need help with <span>TaskPro</span>, check out our support resources or reach out to our customer support team.</p>
        <div className={styles.cardFooter}>
            <img src={helpCircle} alt="help circle" />
            <p>Need help?</p>
        </div>
    </div>
  )
}

export default SidebarCard