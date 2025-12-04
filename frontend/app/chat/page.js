"use client";
import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightPanel from "@/components/RightPanel";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import dynamic from "next/dynamic";
const ASLInterpreter = dynamic(() => import("@/components/ASLInterpreter"), {
  ssr: false,
});
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

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

  // NEW: text controlled at parent
  const [text, setText] = useState("");

  const router = useRouter();

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

  const sendMessage = async (textInput, speakResponse) => {
    if (!textInput.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: textInput };
    setMessages((m) => [...m, userMessage]);

    // clear input box
    setText("");

    if (!isLoggedIn) {
      const loginReply = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Please login first to start a chat.",
      };
      setTimeout(() => {
        setMessages((m) => [...m, loginReply]);
      }, 300);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Your session expired. Please login again.",
        },
      ]);
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
          query: textInput,
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
    if (!isLoggedIn) {
      setMessages([LOGIN_PROMPT_MESSAGE]);
    } else {
      setMessages([
        {
          id: "system-welcome-new",
          role: "assistant",
          text: "New chat started. How can I help?",
        },
      ]);
    }
    setCurrentSessionId(null);
    localStorage.removeItem("currentSessionId");
    setPendingChat(true);
  };

  // NEW: ASL callback → add characters to chat input
  const handleAppendFromASL = (char) => {
  setText((prev) => {
    // CLEAR
    if (char === "__CLEAR__") return "";

    // BACKSPACE
    if (char === "__BACKSPACE__") return prev.slice(0, -1);

    // NORMAL APPEND
    return prev + char;
  });
};

const handleAutoSend = async () => {
  if (text.trim().length === 0) return;

  console.log("📤 Auto-Sending:", text);

  await sendMessage(text, null);   // << FIXED
  setText("");                     
};




  return (
    <div className="chat-layout h-screen">
      {/* LEFT SIDEBAR */}
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

      {/* MAIN CHAT */}
      <main className="chat-main">
        <section className="chat-section !p-0">

          {/* CHAT WINDOW */}
          <div className="flex-1 overflow-y-auto bg-white p-6">
            <ChatWindow messages={messages} />
          </div>

          {/* ASL FLOATING CAMERA */}
          <ASLInterpreter onAppendFromASL={handleAppendFromASL} 
          onAutoSend={handleAutoSend}
          />

          {/* CHAT INPUT */}
          <div className="border-t border-gray-200 bg-white p-4">
            <ChatInput
              onSend={sendMessage}
              onOpenRight={() => setRightOpen(true)}
              text={text}        // NEW
              setText={setText}  // NEW
            />
          </div>
        </section>
      </main>

      {/* RIGHT SIDEBAR */}
      {rightOpen ? (
        <div className="sidebar-area right open max-h-[85vh] min-w-[240px] w-[280px] max-w-[320px] top-[10px] rounded-[20px] bg-white">
          <RightPanel open={rightOpen} onClose={() => setRightOpen(false)} />
        </div>
      ) : (
        <button
          onClick={() => setRightOpen(true)}
          className="flex w-[40px] flex-shrink-0 right-[10px] min-h-[35px] rounded-[10px] text-white bg-[#155DFC] items-start relative top-[20px] pt-[2px] pr-[13px] pb-0 pl-[13px] h-0 justify-center text-2xl"
        >
          ≡
        </button>
      )}
    </div>
  );
}
