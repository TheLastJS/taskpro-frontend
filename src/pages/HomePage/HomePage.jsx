import React, { useState, useEffect } from "react";
import UserInfo from "../../components/UserInfo/UserInfo";
import LogoutIcon from "@mui/icons-material/Logout";
import icon from "../../assets/icon.svg";
import helpImage from "../../assets/help-image.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../redux/auth/authOperations";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../../redux/auth/authSlice";
import HelpModal from "../../components/HelpModal";

function HomePage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (token && (!user || !user.name)) {
      axios.get("/users/current", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        dispatch(setUser(res.data.data));
      });
    }
  }, [token, user, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/auth/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#1F1F1F" }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: "#121212", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 24, marginBottom: 32 }}>
          <img src={icon} alt="TaskPro Icon" style={{ width: 32, height: 32 }} />
          Task Pro
        </div>
        <div style={{ flex: 1, width: "100%" }}>
          <button style={{ width: "100%", padding: 12, borderRadius: 8, background: "#bedbb0", color: "#151515", border: "none", marginBottom: 16, fontWeight: 500 }}>
            + Create a new board
          </button>
          {/* Board listesi burada olacak */}
        </div>
        {/* Help Card */}
        <div style={{
          background: "#1F1F1F",
          borderRadius: 16,
          padding: 20,
          marginTop: 24,
          width: 200,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <img src={helpImage} alt="Help" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 15, textAlign: "center", marginBottom: 12 }}>
            If you need help with <span style={{ color: "#BEDBB0" }}>TaskPro</span>, check out our support resources or reach out to our customer support team.
          </div>
          <button style={{
            background: "none",
            border: "1px solid #BEDBB0",
            color: "#BEDBB0",
            borderRadius: 8,
            padding: "6px 16px",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 14
          }} onClick={() => setHelpOpen(true)}>Need help?</button>
        </div>
        <div style={{ marginTop: 32, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={handleLogout}>
            <LogoutIcon style={{ fontSize: 22, color: "rgb(190, 219, 176)" }} /> Log out
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ height: 64, background: "#121212", color: "#fff", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #bedbb0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                background: "#bedbb0",
                color: "#151515",
                fontWeight: 700,
                fontSize: 20,
                textAlign: "center",
                userSelect: "none"
              }}
              onClick={() => setProfileOpen(true)}
            >
              {user && user.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                user && user.name ? user.name[0].toUpperCase() : "?"
              )}
            </span>
          </div>
        </header>
        {/* Main area */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#bdbdbd", fontSize: 20, textAlign: "center", maxWidth: 600 }}>
            Before starting your project, it is essential to <span style={{ color: "#bedbb0" }}>create a board</span> to visualize and track all the necessary tasks and milestones. This board serves as a powerful tool to organize the workflow and ensure effective collaboration among team members.
          </div>
        </main>
      </div>
      {/* UserInfo Modal */}
      {profileOpen && <UserInfo onClose={() => setProfileOpen(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

export default HomePage;
