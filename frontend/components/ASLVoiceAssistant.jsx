"use client";
import React, { useRef, useState } from "react";

export default function VoiceAssistant({ onVoiceText }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current.ondataavailable = async (event) => {
      const blob = event.data;
      const wavBlob = await convertToWav(blob);

      const formData = new FormData();
      formData.append("file", wavBlob, "audio.wav");

      const res = await fetch("http://localhost:8000/voice/stt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) onVoiceText(data.text);
    };

    mediaRecorderRef.current.start(300); // send chunk every 300 ms
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      style={{ background: recording ? "red" : "blue" }}
    >
      🎙️ Voice {recording ? "Stop" : "Start"}
    </button>
  );
}

function convertToWav(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;

      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);

      view.setUint32(0, 0x52494646, false);
      view.setUint32(8, 0x57415645, false);
      view.setUint32(12, 0x666d7420, false);
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, 16000, true);
      view.setUint32(28, 32000, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      view.setUint32(36, 0x64617461, false);
      view.setUint32(40, buffer.byteLength, true);

      resolve(new Blob([wavHeader, buffer], { type: "audio/wav" }));
    };
    reader.readAsArrayBuffer(blob);
  });
}
