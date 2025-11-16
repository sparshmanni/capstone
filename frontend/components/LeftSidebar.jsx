"use client";
import React, { useState, useEffect } from "react";

const LeftSidebar = ({
  open = true,
  onClose,
  onSelectSession,
  onPrepareNewChat, // renamed handler
}) => {
  const [sessions, setSessions] = useState([]);
  const [token, setToken] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenFromLocalStorage = localStorage.getItem("token");
      setToken(tokenFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    async function fetchSessions() {
      try {
        const res = await fetch("http://127.0.0.1:8000/chatbot/sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to load sessions");
        const data = await res.json();
        if (Array.isArray(data)) setSessions(data);
      } catch (err) {
        console.error("Fetch sessions failed:", err);
      }
    }
    fetchSessions();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  // ❌ No API call here
  const handleNewChat = () => {
    if (onPrepareNewChat) onPrepareNewChat(); // only clear UI, not backend
  };

  const handleSessionClick = (id) => {
    if (onSelectSession) onSelectSession(id);
  };

  const handleMenuClick = (e, sessionId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === sessionId ? null : sessionId);
  };



const handleDelete = async (e, sessionId) => {
  e.stopPropagation();
  try {
    const res = await fetch(`http://127.0.0.1:8000/chatbot/session/${sessionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete session");
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  } catch (err) {
    console.error("Error deleting session:", err);
  } finally {
    setOpenMenuId(null);
  }
};




  // <-- NEW: Placeholder function for Download

const handleDownload = async (e, sessionId) => {
  e.stopPropagation();
  try {
    const res = await fetch(`http://127.0.0.1:8000/chatbot/session/${sessionId}/download_pdf`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to download PDF");

    // Get PDF blob
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Trigger file download
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat_${sessionId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading PDF:", err);
  } finally {
    setOpenMenuId(null);
  }
};



  return (
    <div className="flex h-full flex-col p-4 ">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="m-0 text-xl font-bold text-blue-700">Chats</h3>
          <button
            onClick={onClose}
            className="close-btn text-2xl text-gray-500 hover:text-blue-600"
          >
            ×
          </button>
        </div>

        <button
          onClick={handleNewChat}
          className="mb-4 w-full rounded-xl flex justify-center items-center gap-[2px] bg-blue-600 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-700"
        >
          <span>
            <lord-icon
              src="https://cdn.lordicon.com/gzqofmcx.json"
              trigger="loop"
              delay="1000"
              colors="primary:#ffffff"
            ></lord-icon>
          </span>
          <span>New Chat</span>
        </button>

        <div className="flex-grow overflow-y-auto flex py-[20px] flex-col gap-2">
          {sessions.length === 0 ? (
            <div className="mt-12 text-center text-sm text-gray-400">
              No chats yet
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="relative">
                <button
                  onClick={() => handleSessionClick(session.id)}
                  className="w-full text-left rounded-xl flex items-center justify-between border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="truncate pr-2">{session.title}</span>
                  <span
                    onClick={(e) => handleMenuClick(e, session.id)}
                    className="rotate-90 p-1 rounded-full hover:bg-gray-200"
                  >
                    <lord-icon
                      className="max-h-[20px]"
                      src="https://cdn.lordicon.com/tewlfgbl.json"
                      delay="2000"
                      colors="primary:#000000"
                    ></lord-icon>
                  </span>
                </button>
                 {/* --- EW: Pop-up Menu --- */}
                                {openMenuId === session.id && (
                                    <div
                                        onClick={(e) => e.stopPropagation()} // Stop clicks inside menu from closing it
                                        className="absolute right-0 top-full mt-1 w-36 rounded-lg bg-white shadow-xl z-10 border border-gray-100 py-1"
                                    >
                                        <button
                                            onClick={(e) => handleDownload(e, session.id)}
                                            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            {/* Placeholder icon, you can change */}
                                            <lord-icon

                                                src="https://cdn.lordicon.com/gqfozvrp.json"

                                                trigger="loop"

                                                delay="1000"

                                                colors="primary:#30e849"

                                            >

                                            </lord-icon>
                                            Download
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, session.id)}
                                            className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            {/* Placeholder icon, you can change */}
                                            <lord-icon

                                                src="https://cdn.lordicon.com/oqeixref.json"

                                                trigger="loop"

                                                delay="1000"

                                                state="hover-trash-full"

                                                colors="primary:#c71f16">

                                            </lord-icon>
                                            Delete
                                        </button>

                                    </div>

                                )}

                                {/* --- End Pop-up Menu --- */}
              </div>
            ))
          )}
        </div>

        <div className="mt-auto pt-6 text-center text-xs opacity-60">
          Tip: Collapse sidebar to focus more on chat.
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
