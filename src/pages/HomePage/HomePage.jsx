import React, { useState, useEffect, useRef } from "react";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../redux/auth/authOperations";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../../redux/auth/authSlice";
import HelpModal from "../../components/HelpModal";

import { Select, MenuItem, InputLabel, FormControl, Box, useMediaQuery } from "@mui/material";
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
const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  padding-right: 32px;
`;

function HomePage({ setTheme, theme }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarShouldAnimateIn, setSidebarShouldAnimateIn] = useState(false);
  const isTabletOrMobile = useMediaQuery('(max-width:1024px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const selectedBoard = useSelector(selectSelectedBoard);
  const sidebarRef = useRef();

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

  useEffect(() => {
    if (isTabletOrMobile) {
      if (sidebarOpen) {
        setSidebarVisible(true);
        setSidebarShouldAnimateIn(false);
        setTimeout(() => setSidebarShouldAnimateIn(true), 10);
      } else {
        setSidebarShouldAnimateIn(false);
        const timeout = setTimeout(() => setSidebarVisible(false), 350);
        return () => clearTimeout(timeout);
      }
    } else {
      setSidebarVisible(true);
      setSidebarShouldAnimateIn(false);
    }
  }, [sidebarOpen, isTabletOrMobile]);

  useEffect(() => {
    if (isTabletOrMobile && sidebarVisible && sidebarOpen) {
    }
  }, [sidebarVisible, sidebarOpen, isTabletOrMobile]);

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
      {/* Hamburger ve Sidebar */}
      {isTabletOrMobile && !sidebarOpen && (
        <button
          style={{
            position: 'fixed',
            top: 24,
            left: 24,
            zIndex: 2001,
            background: 'none',
            border: 'none',
            fontSize: 32,
            cursor: 'pointer',
            color: theme === 'dark' ? '#fff' : '#232323',
          }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          {/* Hamburger icon */}
          <span style={{ display: 'block', width: 32, height: 32 }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><rect y="6" width="32" height="4" rx="2" fill="currentColor"/><rect y="14" width="32" height="4" rx="2" fill="currentColor"/><rect y="22" width="32" height="4" rx="2" fill="currentColor"/></svg>
          </span>
        </button>
      )}
      {(isTabletOrMobile ? sidebarVisible : true) && (
        <div
          style={{
            position: isTabletOrMobile ? 'fixed' : 'sticky',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: isTabletOrMobile ? 2000 : 10,
            flexShrink: 0,
            background: isTabletOrMobile ? 'rgba(0,0,0,0.4)' : undefined,
            width: isTabletOrMobile ? '100vw' : undefined,
            display: 'flex',
            alignItems: 'flex-start',
            transition: isTabletOrMobile ? 'background 0.3s' : undefined,
          }}
          onClick={isTabletOrMobile ? () => setSidebarOpen(false) : undefined}
        >
          {/* Slide animasyonunu sadece mobil/tablet için uygula */}
          <div
            style={{
              width: isTabletOrMobile ? 0 : undefined,
              flex: isTabletOrMobile ? '1 0 auto' : undefined,
              display: 'flex',
              height: '100vh',
            }}
          >
            <div
              ref={sidebarRef}
              style={{
                minWidth: 260,
                maxWidth: 320,
                width: 260,
                height: '100vh',
                background: theme === 'dark' ? '#232323' : theme === 'light' ? '#fff' : '#5255BC',
                boxShadow: isTabletOrMobile ? '0 0 24px rgba(0,0,0,0.25)' : undefined,
                position: isTabletOrMobile ? 'relative' : undefined,
                transform: isTabletOrMobile
                  ? (sidebarShouldAnimateIn ? 'translateX(0)' : 'translateX(-100%)')
                  : 'none',
                transition: isTabletOrMobile ? 'transform 0.35s cubic-bezier(.4,1.3,.5,1), box-shadow 0.3s' : undefined,
              }}
              onClick={e => e.stopPropagation()}
            >
              {isTabletOrMobile && (
                <button
                  style={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    background: 'none',
                    border: 'none',
                    fontSize: 32,
                    color: theme === 'dark' ? '#fff' : '#232323',
                    cursor: 'pointer',
                    zIndex: 2002,
                  }}
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  &times;
                </button>
              )}
              <Sidebar
                onCreateBoard={() => setBoardModalOpen(true)}
                onHelp={() => setHelpOpen(true)}
                onLogout={handleLogout}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
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
                      ? "#FFFFFF"
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
            {user && user.name && !isMobile && (
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  marginRight: 12,
                  color: theme === "light" ? "#161616" : theme === "violet" ? "#000000" : "#fff",
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
              <BoardDetail board={selectedBoard} theme={theme} />
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
                  style={{ color: theme === "violet" ? "#5255BC" : "#bedbb0", cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setBoardModalOpen(true)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setBoardModalOpen(true); }}
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
