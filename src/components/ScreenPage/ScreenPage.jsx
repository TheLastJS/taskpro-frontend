import React from 'react'
// Eğer özel bir filtre ikonu kullanmak istersen import et:
// import filterIcon from '../../assets/filter.svg';

function ScreenPage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "calc(100vh - 48px)", // Header yüksekliği kadar çıkar
        display: "flex",
        flexDirection: "column",
        background: "transparent", // Ana arka planı üst kapsayıcıdan alır
        position: "relative"
      }}
    >
      {/* Filters alanı */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "24px 32px 0 0",
          boxSizing: "border-box",
        }}
      >
        <span style={{ color: "#bdbdbd", fontSize: 16, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          {/* SVG veya Unicode filtre ikonu */}
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Filters
        </span>
      </div>
      {/* Ortadaki açıklama */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            textAlign: "center",
            color: "#bdbdbd",
            fontFamily: "Poppins, Arial, sans-serif",
            fontSize: 16,
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          Before starting your project, it is essential <b>to create a board</b> to visualize
          and track all the necessary tasks and milestones. This board serves as a powerful tool to organize the workflow and ensure effective collaboration among team members.
        </div>
      </div>
    </div>
  )
}

export default ScreenPage