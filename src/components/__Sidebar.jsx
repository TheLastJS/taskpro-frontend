import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectBoards,
  selectBoardsLoading,
  selectSelectedBoardId,
} from "../redux/board/boardSelectors";
import {
  fetchBoardsThunk,
  updateBoardThunk,
  deleteBoardThunk,
} from "../redux/board/boardOperations";
import { setSelectedBoard } from "../redux/board/boardSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ExtensionIcon from "@mui/icons-material/Extension";
import CategoryIcon from "@mui/icons-material/Category";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HexagonIcon from "@mui/icons-material/Hexagon";
import LogoutIcon from "@mui/icons-material/Logout";
import icon from "../assets/icon.svg";
import helpImage from "../assets/help-image.png";
import sidebarstyle from "../components/Sidebar.module.css";
import pencil from "../assets/icons/pencil.svg";
import trash from "../assets/icons/trash.svg";
import BoardModal from "./BoardModal";
import CloseIcon from '@mui/icons-material/Close';

const iconMap = {
  "icon-project": <WorkIcon fontSize="small" />,
  "icon-star": <StarIcon fontSize="small" />,
  "icon-loading": <AutorenewIcon fontSize="small" />,
  "icon-puzzle-piece": <ExtensionIcon fontSize="small" />,
  "icon-container": <CategoryIcon fontSize="small" />,
  "icon-light-bulb": <LightbulbIcon fontSize="small" />,
  "icon-colors": <ColorLensIcon fontSize="small" />,
  "icon-hexagon": <HexagonIcon fontSize="small" />,
};

const Sidebar = ({ onCreateBoard, onHelp, onLogout, theme = "dark", open = true, setOpen }) => {
  const dispatch = useDispatch();
  const boards = useSelector(selectBoards);
  const loading = useSelector(selectBoardsLoading);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBoardModal, setEditBoardModal] = useState({ open: false, board: null });

  // Responsive helper
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 800;

  useEffect(() => {
    dispatch(fetchBoardsThunk());
  }, [dispatch]);

  const handleEdit = (board) => {
    setEditBoardModal({ open: true, board });
  };

  const handleEditChange = (e) => setEditTitle(e.target.value);

  const handleEditSave = (board) => {
    if (editTitle.trim() && editTitle !== board.title) {
      dispatch(
        updateBoardThunk({
          id: board._id,
          title: editTitle,
          icon: board.icon,
          background: board.background,
        })
      );
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = (board) => {
    if (window.confirm(`Delete board "${board.title}"?`)) {
      dispatch(deleteBoardThunk(board._id));
    }
  };

  // Sidebar style
  const sidebarStyle = {
    width: 260,
    background:
      theme === "dark" ? "#232323" : theme === "light" ? "#FFFFFF" : "#fff",
    color: theme === "dark" ? "#fff" : "#232323",
    padding: 24,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: isMobile ? 'fixed' : 'relative',
    top: 0,
    left: isMobile ? (open ? 0 : -300) : 0,
    zIndex: 3000,
    transition: isMobile ? 'left 0.3s cubic-bezier(.4,0,.2,1)' : undefined,
    boxShadow: isMobile && open ? '2px 0 16px rgba(0,0,0,0.18)' : undefined,
    borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Mobilde sidebar açıkken kapat butonu */}
      {isMobile && open && setOpen && (
        <button
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2100,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            backgroundColor: theme === 'dark' ? '#232323' : '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Close sidebar"
        >
          <CloseIcon style={{ color: theme === 'dark' ? '#fff' : '#232323', fontSize: 28 }} />
        </button>
      )}
      {/* Logo ve başlık */}
      <div
        style={{

          width: 260,
          background:
            theme === "dark" ? "#232323" : theme === "light" ? "#FFFFFF" : "#5255BC",
          color: theme === "dark" ? "#fff" : theme === "violet" ? "#FFFFFF" : "#232323",
          padding: 24,
          minHeight: "100vh",

        }}
      >
        <img src={icon} alt="TaskPro Icon" style={{ width: 32, height: 32 }} />
        Task Pro
      </div>
      {/* Boards kartı */}
      <div
        style={{
          borderRadius: 16,
          marginBottom: 24,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            fontSize: 13,
            fontWeight: 400,
            margin: 0,
            marginBottom: 16,
            color: theme === "dark" ? "#fff" : "light" ? "#232323" : "#232323",
          }}
        >
          My boards
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: 40,
            padding: "8px 0",
          }}
        >
          <p
            style={{
              maxWidth: 100,
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "-0.02em",
            }}
          >
            Create a new board
          </p>
          <button
            style={{

              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: theme === "light" ? "1px solid rgba(35, 35, 35, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              borderBottom: theme === "light" ? "1px solid rgba(35, 35, 35, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: 40,
              padding: "8px 0",

            }}
            onClick={onCreateBoard}
          >
            +
          </button>
        </div>

        {/* 👇 Scrollable board list */}
        <div
          style={{ overflowY: "auto", flex: 1 }}
          className={sidebarstyle.scrollableList}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {boards.map((board) => (
                <li
                  key={board._id}
                  style={{
                    padding: "8px 12px",
                    marginBottom: 8,
                    background:
                      selectedBoardId === board._id
                        ? "#333"
                        : theme === "light"
                        ? "#F6F6F7"
                        : "#232323",
                    borderRadius: 4,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                    color: "#fff",
                  }}
                  onClick={() => dispatch(setSelectedBoard(board._id))}
                >
                  {editingId === board._id ? (
                    <input
                      value={editTitle}
                      onChange={handleEditChange}
                      onBlur={() => handleEditSave(board)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(board);
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditTitle("");
                        }
                      }}
                      autoFocus
                      style={{
                        flex: 1,
                        marginRight: 8,
                        display: "flex",
                        alignItems: "center",
                        color: selectedBoardId === board._id
                          ? theme === "dark" ? "#fff" : theme === "light" ? "#232323" : "#fff"
                          : theme === "dark" ? "rgba(255, 255, 255, 0.5)" : theme === "light" ? "rgba(35, 35, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        flex: 1,
                        marginRight: 8,
                        display: "flex",
                        alignItems: "center",
                        color: selectedBoardId === board._id
                          ? theme === "dark" ? "#fff" : theme === "light" ? "#232323" : "#fff"
                          : theme === "dark" ? "rgba(255, 255, 255, 0.5)" : theme === "light" ? "rgba(35, 35, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {iconMap[board.icon] || <WorkIcon fontSize="small" />} {board.title}
                    </span>
                  )}
                  <div
                    style={{ display: "flex", gap: 2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: "flex", gap: 9.45 }}>
                      <img
                        style={{ 
                          cursor: "pointer",
                          filter: theme === 'dark' ? 'none' : theme === 'violet' ? 'none' : 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(100%)',
                          opacity: theme === 'violet' ? 0.5 : 1
                        }}
                        src={pencil}
                        alt="pencil"
                        onClick={() => handleEdit(board)}
                      />
                      <img
                        style={{ 
                          cursor: "pointer",
                          filter: theme === 'dark' ? 'none' : theme === 'violet' ? 'none' : 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(100%)',
                          opacity: theme === 'violet' ? 0.5 : 1
                        }}
                        src={trash}
                        alt="trash"
                        onClick={() => handleDelete(board)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Bottom fixed section */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          background: theme === "dark" ? "#232323" : theme === "light" ? "#FFFFFF" : "#fff",
        }}
      >
        {/* Help Card */}
        <div
          style={{
            background:
              theme === "dark"
                ? "#292929"
                : theme === "light"
                ? "#F6F6F7"
                : "#8F92D6",
            borderRadius: 16,
            padding: 20,
            width: "100%",
            color: theme === "dark" ? "#fff" : "#232323",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: 24,
          }}
        >
          <img src={helpImage} alt="Help" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 15, textAlign: "center", marginBottom: 12 }}>
            If you need help with{" "}
            <span style={{ color: "#BEDBB0" }}>TaskPro</span>, check out our
            support resources or reach out to our customer support team.
          </div>
          <button
            style={{
              background: "none",
              border: `1px solid ${theme === "violet" ? "#5255BC" : "#BEDBB0"}`,
              color: theme === "violet" ? "#5255BC" : "#BEDBB0",
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 14,
            }}
            onClick={onHelp}
          >
            Need help?
          </button>
        </div>
        {/* Logout Button */}
        <button
          style={{
            background: "none",
            border: "none",
            color:
              theme === "light"
                ? "#BEDBB0"
                : theme === "violet"
                ? "#FFFFFF"
                : "#BEDBB0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            width: "100%",
            padding: 12,
          }}
          onClick={onLogout}
        >
          <LogoutIcon style={{ fontSize: 22 }} /> Log out
        </button>
      </div>
      {editBoardModal.open && (
        <BoardModal
          open={editBoardModal.open}
          onClose={() => setEditBoardModal({ open: false, board: null })}
          editBoard={true}
          initialBoard={editBoardModal.board}
        />
      )}
    </aside>
  );
};

export default Sidebar;
