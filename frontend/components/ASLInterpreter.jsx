"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ASLInterpreter({ onAppendFromASL, onAutoSend }) {
  const videoRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [lastChar, setLastChar] = useState("-");

  // Buffers + timers
  const bufferRef = useRef([]);
  const lastAcceptedTime = useRef(0);
  const lastHandSeen = useRef(Date.now());

  // Prevent auto-send loops
  const autoSendReady = useRef(false);

  // FIX: always keep latest callback
  const autoSendRef = useRef(onAutoSend);
  useEffect(() => {
    autoSendRef.current = onAutoSend;
  }, [onAutoSend]);

  // Settings
  const INTERVAL = 150;
  const BUFFER_SIZE = 8;
  const MIN_VOTES = 4;
  const COOLDOWN = 500; // ms
  const AUTO_SEND_DELAY = 5000; // ms

  // ------------------------------
  // Send one frame to backend
  // ------------------------------
  const sendFrame = async () => {
    if (!running || !videoRef.current) return;

    // Capture frame
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8)
    );

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch("http://localhost:8001/asl/predict-frame", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) return;

      const data = await res.json();
      const pred = data.prediction;

      // push into buffer
      bufferRef.current.push(pred);
      if (bufferRef.current.length > 12) bufferRef.current.shift();

      // -----------------------------
      // HAND ABSENCE DETECTION
      // -----------------------------
      const validLetters = "abcdefghijklmnopqrstuvwxyz ";
      let validCount = 0;

      for (const p of bufferRef.current) {
        if (validLetters.includes(p)) validCount++;
      }

      const handMissing = validCount < 3;

      if (handMissing) {
        const elapsed = Date.now() - lastHandSeen.current;

        if (autoSendReady.current && elapsed > AUTO_SEND_DELAY) {
          console.log("⏳ Auto-Send Triggered (hand missing)!");

          // FIX: use ref callback to avoid stale closure
          autoSendRef.current();

          autoSendReady.current = false;
          lastHandSeen.current = Date.now();
        }
      } else {
        // Hand visible → reset timer
        lastHandSeen.current = Date.now();
        autoSendReady.current = true; // re-arm auto-send
      }

      // Continue gesture recognition
      processPrediction();
    } catch (e) {
      console.log("ASL API error:", e);
    }
  };

  // ------------------------------
  // Majority vote + cooldown
  // ------------------------------
  const processPrediction = () => {
    const now = Date.now();
    if (now - lastAcceptedTime.current < COOLDOWN) return;

    const counts = {};
    for (const c of bufferRef.current) {
      if (c === "4") continue;
      counts[c] = (counts[c] || 0) + 1;
    }

    // Find best
    let best = null,
      max = 0;

    for (const [key, val] of Object.entries(counts)) {
      if (val > max) {
        best = key;
        max = val;
      }
    }

    if (!best || max < MIN_VOTES) return;

    // Accept
    lastAcceptedTime.current = Date.now();
    bufferRef.current = [];
    setLastChar(best);

    autoSendReady.current = true; // gesture = active typing

    if (best === "1") onAppendFromASL("__BACKSPACE__");
    else if (best === "2") onAppendFromASL("__CLEAR__");
    else if (best === "3") onAppendFromASL(" ");
    else onAppendFromASL(best);
  };

  // ------------------------------
  // Start/Stop camera
  // ------------------------------
  useEffect(() => {
    let intervalId;

    if (running) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        intervalId = setInterval(sendFrame, INTERVAL);
      });
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    }

    return () => clearInterval(intervalId);
  }, [running]);

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div
      style={{
        position: "absolute",
        right: "1rem",
        bottom: "4.5rem",
        width: "220px",
        padding: "0.5rem",
        background: "rgba(0,0,0,0.75)",
        borderRadius: "8px",
        color: "white",
        zIndex: 1000,
      }}
    >
      <div style={{ marginBottom: "4px", fontSize: "0.85rem" }}>
        ASL Interpreter (Backend)
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          borderRadius: "6px",
          background: "black",
        }}
      ></video>

      <div
        style={{
          marginTop: "0.4rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Last: {lastChar}</span>
        <button
          onClick={() => {
            setRunning((r) => !r);
            bufferRef.current = [];
            autoSendReady.current = false;
          }}
          style={{
            padding: "2px 6px",
            borderRadius: "4px",
            background: running ? "#c62828" : "#2e7d32",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}
