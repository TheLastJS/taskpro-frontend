import React from "react";
// Profil fotoğrafı için örnek bir görsel (kendi yolunu kullanabilirsin)
import profileImg from "../../assets/Vector.png"; // Kendi profil görselinin yolunu yaz

function Header({ broken, toggled, setToggled }) {
  return (
    <header
      style={{
        width: "100%",
        height: "48px",
        background: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 24px",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* Hamburger Menü */}
      {broken && !toggled && (
        <button
          onClick={() => setToggled(true)}
          style={{
            position: "absolute",
            left: 16,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 28,
            cursor: "pointer",
            zIndex: 1500
          }}
          aria-label="Menüyü Aç"
        >
          &#9776;
        </button>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginLeft: broken ? 40 : 0 }}>
        {/* Tema seçici */}
        <div style={{ color: "#fff", fontSize: 14, cursor: "pointer" }}>
          Theme <span style={{ fontSize: 12 }}>▼</span>
        </div>
        {/* Kullanıcı adı ve profil fotoğrafı */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#fff", fontSize: 15 }}>Ivetta</span>
          <img
            src={profileImg}
            alt="Profil"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #fff",
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
