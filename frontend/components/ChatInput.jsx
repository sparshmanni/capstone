"use client";
import React, { useState, useEffect, useRef, useCallback } from "react"; // <-- 1. Import useCallback

export default function ChatInput({ onSend, onOpenRight }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [listeningText, setListeningText] = useState("");

  const recognitionRef = useRef(null);

  // -----------------------------
  // 🧠 Speak AI responses aloud
  // -----------------------------
  const speakResponse = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // -----------------------------
  // ✉️ Send text
  // -----------------------------
  // <-- 2. Wrap handleSend in useCallback -->
  const handleSend = useCallback(
    (message) => {
      if (message.trim()) {
        onSend(message, speakResponse);
        setText("");
      }
    },
    [onSend, speakResponse]
  ); // Dependencies are the props it uses

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(text);
    }
  };

  // -----------------------------
  // 🎙 Start speech recording
  // -----------------------------
  // <-- 3. Wrap startRecording in useCallback -->
  const startRecording = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (recognitionRef.current && isRecording) return;

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    setListeningText("🎙 Listening...");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      handleSend(transcript); // Now uses the memoized handleSend
      setIsRecording(false);
      setListeningText("");
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setListeningText("");
    };

    recognition.onend = () => {
      setIsRecording(false);
      setListeningText("");
    };
  }, [isRecording, handleSend]); // Dependency on memoized handleSend

  // -----------------------------
  // ⌨️ Spacebar toggle for recording
  // -----------------------------

  // 🛑 Stop speaking
  // <-- 4. Wrap stopSpeaking in useCallback -->
  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      console.log("🛑 Speech stopped");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (isRecording) {
          recognitionRef.current?.stop();
          setIsRecording(false);
        } else {
          startRecording();
        }
      }

      // Stop speech on Esc key
      if (e.code === "Escape") {
        stopSpeaking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, startRecording, stopSpeaking]); // <-- 5. Add all function dependencies

  // -----------------------------
  // 🧩 UI
  // -----------------------------
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        position: "relative",
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        style={{
          flexGrow: 1,
          resize: "none",
          borderRadius: "6px",
          border: "1px solid #ccc",
          padding: "0.5rem",
        }}
      />
      <button onClick={() => handleSend(text)}>Send</button>
      <button
        onClick={startRecording}
        style={{
          backgroundColor: isRecording ? "red" : "white",
          color: isRecording ? "white" : "black",
        }}
      >
        🎤
      </button>
      <button onClick={onOpenRight}>≡</button>

      {listeningText && (
        <div
          style={{
            position: "absolute",
            bottom: "110%",
            left: "10px",
            background: "#0078ff",
            color: "white",
            borderRadius: "6px",
            padding: "4px 8px",
            fontSize: "0.8rem",
          }}
        >
          {listeningText}
        </div>
      )}
    </div>
  );
}























