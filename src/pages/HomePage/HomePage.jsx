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

import { Select, MenuItem, InputLabel, FormControl, Box } from "@mui/material";
import styled from "styled-components";
import BoardModal from "../../components/BoardModal";
import Sidebar from "../../components/Sidebar";
import BoardDetail from "../../components/BoardDetail";
import { selectSelectedBoard } from "../../redux/board/boardSelectors";
import { backgroundTypes } from "../../components/BoardModal";
import scrollbar from "../../components/Sidebar.module.css";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
`;
const SidebarContainer = styled.aside`
  width: 260px;
  background: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
`;
const Header = styled.header`
  height: 64px;
  background: ${({ theme }) => theme.header};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 20;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.helpCard};
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  width: 200px;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;
const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
`;

const BoardButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.accent};
  color: #151515;
  border: none;
  margin-bottom: 16px;
  font-weight: 500;
`;
const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function HomePage({ setTheme, theme }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const selectedBoard = useSelector(selectSelectedBoard);

  useEffect(() => {
    if (token && (!user || !user.name)) {
      axios
        .get("/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch(setUser(res.data.data));
        });
    }
  }, [token, user, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/auth/login");
  };

  // Board background görselini bul
  let boardBgImg = undefined;
  if (selectedBoard) {
    const bgObj = backgroundTypes.find(
      (bg) => bg.name === selectedBoard.background
    );
    boardBgImg = bgObj ? bgObj.img : undefined;
  }

  return (
    <Layout>
      {/* Sidebar */}
      <div
        style={{
          position: "sticky",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Sidebar
          onCreateBoard={() => setBoardModalOpen(true)}
          onHelp={() => setHelpOpen(true)}
          onLogout={handleLogout}
          theme={theme}
        />
      </div>
      {/* Sağ ana alan: header + main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 120, mr: 2 }}
            >
              <InputLabel
                id="theme-select-label"
                sx={{
                  color: theme === "dark" ? "#fff" : "#000",
                  "&.Mui-focused": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "&.MuiInputLabel-shrink": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                }}
              >
                Theme
              </InputLabel>
              <Select
                labelId="theme-select-label"
                id="theme-select"
                value={theme}
                label="Theme"
                onChange={(e) => setTheme(e.target.value)}
                sx={{
                  color:
                    theme === "light"
                      ? "#161616"
                      : theme === "dark"
                      ? "#fff"
                      : "#000",
                  background:
                    theme === "violet"
                      ? "#D6D8FF"
                      : theme === "light"
                      ? "#fff"
                      : "#232323",
                  borderRadius: 2,
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "violet" ? "#5255BC" : "#bedbb0",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "violet" ? "#5255BC" : "#bedbb0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "violet" ? "#5255BC" : "#bedbb0",
                  },
                  ".MuiSvgIcon-root": {
                    color: theme === "violet" ? "#5255BC" : "#bedbb0",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor:
                        theme === "violet"
                          ? "#ECEDFD"
                          : theme === "light"
                          ? "#fff"
                          : "#232323",
                      color:
                        theme === "light"
                          ? "#161616"
                          : theme === "dark"
                          ? "#fff"
                          : "#000",
                      borderRadius: 2,
                      boxShadow: 3,
                    },
                  },
                }}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="violet">Violet</MenuItem>
              </Select>
            </FormControl>
            {user && user.name && (
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  marginRight: 12,
                  color: theme === "light" ? "#161616" : "#fff",
                  maxWidth: 180,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </span>
            )}
            <span
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                overflow: "hidden",
                border: `2px solid ${
                  theme === "violet" ? "#5255BC" : "#bedbb0"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                background: theme === "violet" ? "#ECEDFD" : "#bedbb0",
                color: theme === "violet" ? "#5255BC" : "#151515",
                fontWeight: 700,
                fontSize: 20,
                textAlign: "center",
                userSelect: "none",
              }}
              onClick={() => setProfileOpen(true)}
            >
              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : user && user.name ? (
                user.name[0].toUpperCase()
              ) : (
                "?"
              )}
            </span>
          </Box>
        </Header>
        <Main
          style={
            boardBgImg
              ? {
                  background: `url(${boardBgImg}) center center / cover no-repeat`,
                  transition: "background 0.3s",
                }
              : {}
          }
          className={scrollbar.scrollableList}
        >
          {selectedBoard ? (
            <div style={{ padding: "32px 0 0 32px", minWidth: "fit-content" }}>
              <BoardDetail board={selectedBoard} />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  color: theme === "dark" ? "#bdbdbd" : "#161616",
                  fontSize: 20,
                  textAlign: "center",
                  maxWidth: 600,
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                Before starting your project, it is essential to{" "}
                <span
                  style={{ color: theme === "violet" ? "#5255BC" : "#bedbb0" }}
                >
                  create a board
                </span>{" "}
                to visualize and track all the necessary tasks and milestones.
                This board serves as a powerful tool to organize the workflow
                and ensure effective collaboration among team members.
              </p>
            </div>
          )}
        </Main>
      </div>
      {/* UserInfo Modal */}
      {profileOpen && <UserInfo onClose={() => setProfileOpen(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      {/* Board Ekleme Modalı */}
      <BoardModal
        open={isBoardModalOpen}
        onClose={() => setBoardModalOpen(false)}
      />
    </Layout>
  );
}

export default HomePage;
