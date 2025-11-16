"use client";
import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightPanel from "@/components/RightPanel";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

// Define the login prompt message as a constant
const LOGIN_PROMPT_MESSAGE = {
  id: "system-login-prompt",
  role: "assistant",
  text: "Please login first to start a chat.",
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [pendingChat, setPendingChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // This hook still runs once to set the initial state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const savedSessionId = localStorage.getItem("currentSessionId");
      if (savedSessionId) {
        loadSessionMessages(savedSessionId, token);
      } else {
        setMessages([
          {
            id: "system-welcome",
            role: "assistant",
            text: "Hi! How can I help you today?",
          },
        ]);
      }
    } else {
      setIsLoggedIn(false);
      setMessages([LOGIN_PROMPT_MESSAGE]);
    }
  }, []);

  const loadSessionMessages = async (sessionId, token) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/chatbot/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load session messages");
      const data = await res.json();
      setMessages(data.messages || []);
      setCurrentSessionId(sessionId);
      localStorage.setItem("currentSessionId", sessionId);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  // --- (MODIFIED FUNCTION) ---
  const sendMessage = async (text, speakResponse) => {
    if (!text.trim()) return;

    // 1. Add user's message to the state immediately
    const userMessage = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMessage]);

    // 2. Check if user is logged in
    if (!isLoggedIn) {
      // 3. If NOT logged in, add a "login required" reply and stop
      const loginReply = {
        id: Date.now() + 1, // Ensure unique ID
        role: "assistant",
        text: "Please login first to start a chat.",
      };
      
      // Use a short timeout to make it feel like a real reply
      setTimeout(() => {
        setMessages((m) => [...m, loginReply]);
      }, 300); // 300ms delay
      
      return; // Stop the function here
    }

    // 4. If user IS logged in, proceed with the API call
    const token = localStorage.getItem("token");
    if (!token) {
      // Safety check in case token was removed
      setIsLoggedIn(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', text: 'Your session expired. Please login again.' }]);
      return;
    }

    let sessionId = currentSessionId;

    try {
      const res = await fetch(`${API_URL}/chatbot/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: text,
          session_id: sessionId ? Number(sessionId) : undefined,
        }),
      });

      const data = await res.json();

      if (!sessionId && data.session_id) {
        sessionId = data.session_id;
        setCurrentSessionId(sessionId);
        localStorage.setItem("currentSessionId", sessionId);
        setPendingChat(false);
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.text,
      };
      setMessages((m) => [...m, assistantMessage]);

      if (speakResponse) speakResponse(data.text);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrepareNewChat = () => {
    // If not logged in, just reset to the login prompt
    if (!isLoggedIn) {
      setMessages([LOGIN_PROMPT_MESSAGE]);
    } else {
      // If logged in, clear the chat for a new session
      setMessages([
         {
            id: "system-welcome-new",
            role: "assistant",
            text: "New chat started. How can I help?",
          }
      ]);
    }
    setCurrentSessionId(null);
    localStorage.removeItem("currentSessionId");
    setPendingChat(true);
  };

  return (
    <div className="chat-layout h-screen">
      {leftOpen ? (
        <div className="sidebar-area left open top-[10px] max-h-[85vh] rounded-[20px] bg-white min-w-[240px] w-[280px] max-w-[320px]">
          <LeftSidebar
            open={leftOpen}
            onClose={() => setLeftOpen(false)}
            onSelectSession={(sessionId) =>
              loadSessionMessages(sessionId, localStorage.getItem("token"))
            }
            onPrepareNewChat={handlePrepareNewChat}
          />
        </div>
      ) : (
        <button
          onClick={() => setLeftOpen(true)}
          className="flex h-0 relative top-[20px] left-[10px] bg-[#155DFC] min-h-[35px] rounded-[10px] text-white w-[40px] flex-shrink-0 items-start justify-center text-2xl"
        >
          ≡
        </button>
      )}

      <main className="chat-main ">
        <section className="chat-section !p-0">
          <div className="flex-1 overflow-y-auto bg-white p-6">
            <ChatWindow messages={messages} />
          </div>
          {/* --- (MODIFIED BLOCK) --- */}
          <div className="border-t border-gray-200 bg-white p-4">
            <ChatInput
              onSend={sendMessage}
              onOpenRight={() => setRightOpen(true)}
              // The `disabled` prop is now REMOVED
              // This allows logged-out users to type.
            />
          </div>
        </section>
      </main>

      {rightOpen ? (
        <div className="sidebar-area right open max-h-[85vh]  min-w-[240px] w-[280px] max-w-[320px] top-[10px] rounded-[20px] bg-white">
          <RightPanel open={rightOpen} onClose={() => setRightOpen(false)} />
        </div>
      ) : (
        <button
          onClick={() => setRightOpen(true)}
          className="flex  w-[40px] flex-shrink-0 right-[10px] min-h-[35px] rounded-[10px] text-white bg-[#155DFC] items-start relative top-[20px] pt-[2px] pr-[13px] pb-0 pl-[13px] h-0 justify-center text-2xl"
        >
          ≡
        </button>
      )}
    </div>
  );
}