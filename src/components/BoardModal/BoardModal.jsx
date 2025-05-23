import React, { useState } from "react";
import styles from "./BoardModal.module.css";
import starIcon from "../../assets/icons/star-04.svg";
import loadingIcon from "../../assets/icons/loading-03.svg";
import puzzleIcon from "../../assets/icons/puzzle-piece-02.svg";
import containerIcon from "../../assets/icons/container.svg";
import lightbulbIcon from "../../assets/icons/lightning-02.svg";
import colorsIcon from "../../assets/icons/colors.svg";
import hexagonIcon from "../../assets/icons/hexagon-01.svg";
import bg1 from "../../assets/backgrounds/desktop-images/desktop-1.png";
import bg2 from "../../assets/backgrounds/desktop-images/desktop-2.png";
import bg3 from "../../assets/backgrounds/desktop-images/desktop-3.png";
import bg4 from "../../assets/backgrounds/desktop-images/desktop-4.png";
import bg5 from "../../assets/backgrounds/desktop-images/desktop-5.png";
import bg6 from "../../assets/backgrounds/desktop-images/desktop-6.png";
import bg7 from "../../assets/backgrounds/desktop-images/dektop-7.png";
import bg8 from "../../assets/backgrounds/desktop-images/desktop-8.png";
import bg9 from "../../assets/backgrounds/desktop-images/desktop-9.png";
import bg10 from "../../assets/backgrounds/desktop-images/desktop-10.png";
import bg11 from "../../assets/backgrounds/desktop-images/desktop-11.png";
import bg12 from "../../assets/backgrounds/desktop-images/dekstop-12.png";
import bg13 from "../../assets/backgrounds/desktop-images/desktop-13.png";
import bg14 from "../../assets/backgrounds/desktop-images/desktop-14.png";
import bg15 from "../../assets/backgrounds/desktop-images/desktop-15.png";
import styled, { useTheme } from "styled-components";

const iconTypes = [
  { name: "icon-star", icon: starIcon },
  { name: "icon-loading", icon: loadingIcon },
  { name: "icon-puzzle-piece", icon: puzzleIcon },
  { name: "icon-container", icon: containerIcon },
  { name: "icon-light-bulb", icon: lightbulbIcon },
  { name: "icon-colors", icon: colorsIcon },
  { name: "icon-hexagon", icon: hexagonIcon },
];
const backgroundTypes = [
  { name: "", img: null },
  { name: "00", img: bg1 },
  { name: "01", img: bg2 },
  { name: "02", img: bg3 },
  { name: "03", img: bg4 },
  { name: "04", img: bg5 },
  { name: "05", img: bg6 },
  { name: "06", img: bg7 },
  { name: "07", img: bg8 },
  { name: "08", img: bg9 },
  { name: "09", img: bg10 },
  { name: "10", img: bg11 },
  { name: "11", img: bg12 },
  { name: "12", img: bg13 },
  { name: "13", img: bg14 },
  { name: "14", img: bg15 },
];

const BoardModal = ({ open, onClose, onCreate, themeObj }) => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(iconTypes[0].name);
  const [background, setBackground] = useState(backgroundTypes[0].name);
  const [error, setError] = useState("");

  if (!open) return null;

  // Temaya göre renkler
  const bgColor = themeObj?.card || "#fff";
  const textColor = themeObj?.text || "#161616";
  const inputBg = themeObj?.inputBg || "#fff";
  const inputText = themeObj?.inputText || "#161616";
  const inputBorder = themeObj?.inputBorder || "#bedbb0";
  const accent = themeObj?.accent || "#bedbb0";
  const borderColor = themeObj?.border || "#bedbb0";

  const handleCreate = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onCreate({ title: title.trim(), icon, background });
    setTitle("");
    setIcon(iconTypes[0].name);
    setBackground(backgroundTypes[0].name);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: bgColor,
          borderRadius: 16,
          minWidth: 370,
          maxWidth: "95vw",
          padding: "32px 32px 28px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          color: textColor,
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            color: themeObj?.mode === "dark" ? "#fff" : "#161616",
            fontSize: 28,
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div
          style={{
            fontWeight: 500,
            fontSize: 18,
            color: themeObj?.mode === "dark" ? "#fff" : "#161616",
            marginBottom: 24,
            alignSelf: "flex-start",
          }}
        >
          New board
        </div>
        <input
          style={{
            width: 350,
            height: 49,
            border: `1px solid ${inputBorder}`,
            borderRadius: 8,
            background: inputBg,
            color: "#161616",
            fontSize: 18,
            fontWeight: 500,
            padding: "0 16px",
            marginBottom: 24,
            outline: "none",
            alignSelf: "flex-start",
          }}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <div
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: themeObj?.mode === "dark" ? "#fff" : "#161616",
            marginBottom: 8,
            alignSelf: "flex-start",
          }}
        >
          Icons
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
            alignSelf: "flex-start",
          }}
        >
          {iconTypes.map((i) => (
            <span
              key={i.name}
              onClick={() => setIcon(i.name)}
              style={{
                fontSize: 22,
                padding: 4,
                borderRadius: 4,
                background: icon === i.name ? accent : "transparent",
                cursor: "pointer",
                border:
                  icon === i.name
                    ? `2px solid ${accent}`
                    : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={i.icon}
                alt={i.name}
                style={{
                  width: 24,
                  height: 24,
                  filter:
                    themeObj?.mode === "light" || themeObj?.mode === "violet"
                      ? icon === i.name
                        ? "none"
                        : "grayscale(1) brightness(0.3)"
                      : "none",
                }}
              />
            </span>
          ))}
        </div>
        <div
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: themeObj?.mode === "dark" ? "#fff" : "#161616",
            marginBottom: 8,
            alignSelf: "flex-start",
          }}
        >
          Background
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "nowrap",
            marginBottom: 8,
          }}
        >
          {backgroundTypes.slice(0, 8).map((bg) =>
            bg.img ? (
              <img
                key={bg.name || "none"}
                src={bg.img}
                alt={bg.name}
                onClick={() => setBackground(bg.name)}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 6,
                  border:
                    background === bg.name
                      ? `2px solid ${accent}`
                      : "2px solid transparent",
                  cursor: "pointer",
                }}
              />
            ) : (
              <div
                key="none"
                onClick={() => setBackground("")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  border:
                    background === ""
                      ? `2px solid ${accent}`
                      : `2px solid ${borderColor}`,
                  background: inputBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: 22,
                  cursor: "pointer",
                }}
                title="No background"
              >
                <span style={{ fontSize: 22 }}>&times;</span>
              </div>
            )
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "nowrap",
            marginBottom: 16,
          }}
        >
          {backgroundTypes.slice(8, 16).map((bg) =>
            bg.img ? (
              <img
                key={bg.name}
                src={bg.img}
                alt={bg.name}
                onClick={() => setBackground(bg.name)}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 6,
                  border:
                    background === bg.name
                      ? `2px solid ${accent}`
                      : "2px solid transparent",
                  cursor: "pointer",
                }}
              />
            ) : null
          )}
        </div>
        <button
          type="button"
          onClick={handleCreate}
          style={{
            width: 302,
            height: 49,
            background: accent,
            color: themeObj?.mode === "light" ? "#161616" : "#232323",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 18, marginRight: 6 }}>+</span> Create
        </button>
      </div>
    </div>
  );
};

export default BoardModal;
