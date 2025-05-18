import React from 'react'
import { Sidebar, Menu } from 'react-pro-sidebar';
import styles from "./SideBar.module.css"
import icon from "../../assets/icon.svg";
import addIcon from "../../assets/block.svg"
import SidebarCard from '../SidebarCard/SidebarCard';
import logout from "../../assets/logout.svg"

function SideBar({ broken, toggled, setToggled, setBroken }) {
    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 48px)', backgroundColor: "#121212", justifyContent: "space-between" }}>
            <div style={{ zIndex: 1100, position: 'relative' }}>
                <Sidebar  
                backgroundColor='#121212'  
                toggled={broken ? toggled : true} 
                customBreakPoint="800px" 
                onBreakPoint={setBroken}
                rootStyles={{
                    paddingLeft: "5px",
                    borderRight: "none"
                }} >
                    {/* X Kapat Butonu */}
                    {broken && toggled && (
                        <button
                            onClick={() => setToggled(false)}
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: 28,
                                cursor: 'pointer',
                                zIndex: 1300
                            }}
                            aria-label="Kapat"
                        >
                            &#10005;
                        </button>
                    )}
                    <div className={styles.logo}>
                        <img src={icon} alt="icon" />
                        <p>Task Pro</p>
                    </div>
                    <Menu
                     rootStyles={{
                        color:"white",
                        paddingLeft: "24px",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}>
                        <p style={{
                            fontFamily: "Poppins",
                            fontWeight: "400",
                            fontSize: "12px",
                            lineHeight: "100%",
                            letterSpacing: "-2%",
                            color:"rgba(255, 255, 255, 0.5)",
                            marginTop: "60px"
                        }}>My Board</p>

                        <hr style={{marginTop: "20px", marginRight: "24px", borderColor: "rgba(31, 31, 31, 1)"}} />

                        <div className={styles.boardContainer}>
                            <p style={{width: "76px"}}>Create a new board</p>
                            <img src={addIcon} alt="add" />
                        </div>

                        <hr style={{marginTop: "8px", marginRight: "24px", borderColor: "rgba(31, 31, 31, 1)"}} />

                        <div>
                            <SidebarCard />
                            <div style={{ display: "flex", gap: "14px", marginTop: "28px" }}>
                                <img src={logout} alt="logout" />
                                <p>Log out </p>
                            </div>
                        </div>
                    </Menu>
                </Sidebar>
            </div>
            {/* Ana içerik */}
            <div style={{ flex: 1, position: 'relative', backgroundColor: "rgba(31, 31, 31, 1)" }}>
                <main style={{ padding: 10 }}>
                    {/* Toggle butonu kaldırıldı */}
                </main>
            </div>
        </div>
    )
}

export default SideBar


