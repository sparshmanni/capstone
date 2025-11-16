// components/ModalBar.jsx
import React from "react";

const ModalBar = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        minWidth: "300px",
        minHeight: "150px",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 10, right: 10
        }}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default ModalBar;