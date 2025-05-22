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

const Sidebar = ({ onCreateBoard, onHelp, onLogout, theme = "dark" }) => {
  const dispatch = useDispatch();
  const boards = useSelector(selectBoards);
  const loading = useSelector(selectBoardsLoading);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBoardModal, setEditBoardModal] = useState({ open: false, board: null });

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

  return (
    <>
      <aside
        style={{
          width: 260,
          background:
            theme === "dark" ? "#232323" : theme === "light" ? "#FFFFFF" : "#fff",
          color: theme === "dark" ? "#fff" : "#232323",
          padding: 24,
          minHeight: "100vh",
        }}
      >
        {/* Logo ve başlık */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 700,
            fontSize: 24,
            marginBottom: 60,
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
            maxHeight: 300, // Kartın toplam yüksekliği
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
                width: 40,
                height: 36,
                borderRadius: 6,
                background: "#bedbb0",
                color: "#161616",
                border: "none",
                fontWeight: 500,
                fontSize: 20,
                cursor: "pointer",
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
                    <span
                      style={{
                        marginRight: 8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {iconMap[board.icon] || <WorkIcon fontSize="small" />}
                    </span>
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
                          borderRadius: 4,
                          border: "1px solid #ccc",
                          padding: 4,
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {board.title}
                      </span>
                    )}
                    <div
                      style={{ display: "flex", gap: 2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <IconButton size="small" onClick={() => handleEdit(board)}>
                        <EditIcon fontSize="small" style={{ color: "#bedbb0" }} />
                      </IconButton> */}
                      {/* <IconButton
                        size="small"
                        onClick={() => handleDelete(board)}
                      >
                        <DeleteIcon
                          fontSize="small"
                          style={{ color: "#e57373" }}
                        />
                      </IconButton> */}
                      <div style={{ display: "flex", gap: 9.45 }}>
                        <img
                          style={{ cursor: "pointer" }}
                          src={pencil}
                          alt="pencil"
                          onClick={() => handleEdit(board)}
                        />
                        <img
                          style={{ cursor: "pointer" }}
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
        {/* Help Card */}
        <div
          style={{
            background:
              theme === "dark"
                ? "#292929"
                : theme === "light"
                ? "#F6F6F7"
                : "#f5f5f5",
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
        <div style={{ marginTop: "auto", width: "100%" }}>
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
      </aside>
      {editBoardModal.open && (
        <BoardModal
          open={editBoardModal.open}
          onClose={() => setEditBoardModal({ open: false, board: null })}
          editBoard={true}
          initialBoard={editBoardModal.board}
        />
      )}
    </>
  );
};

export default Sidebar;
