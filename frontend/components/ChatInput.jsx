// chatinput.jsx
"use client";
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";

export default function ChatInput({ onSend, onOpenRight, text, setText }) {
  const [recording, setRecording] = useState(false);

  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const pcmDataRef = useRef([]); // array of Int16Array chunks

  // ---------- TTS for chatbot reply ----------
  const speakResponse = (msg) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ---------- Send text to chatbot ----------
  const handleSend = useCallback(
    (message) => {
      if (message.trim()) {
        onSend(message, speakResponse);
        setText("");
      }
    },
    [onSend, setText]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(text);
    }
  };

  // ---------- Float32 → Int16 helper ----------
  const float32ToInt16 = (float32Array) => {
    const int16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let s = float32Array[i];
      // clamp
      if (s > 1) s = 1;
      else if (s < -1) s = -1;
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16;
  };

  // ---------- Build a proper WAV from Int16 PCM ----------
  const encodeWAV = (samplesInt16, sampleRate) => {
    const numChannels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;

    const dataSize = samplesInt16.length * bytesPerSample;
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    const writeString = (view, offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    // RIFF header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true); // file size - 8
    writeString(view, 8, "WAVE");

    // fmt  chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // PCM subchunk size
    view.setUint16(20, 1, true); // audio format = PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(
      28,
      sampleRate * numChannels * bytesPerSample,
      true
    ); // byte rate
    view.setUint16(32, numChannels * bytesPerSample, true); // block align
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    // Join header + samples
    const wavBlob = new Blob([buffer, samplesInt16.buffer], {
      type: "audio/wav",
    });
    return wavBlob;
  };

  // ---------- START recording (Web Audio) ----------
  const startRecording = useCallback(async () => {
    if (recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass({
        sampleRate: 16000, // request 16k (browser may adjust)
      });

      const source = audioContext.createMediaStreamSource(stream);

      // ScriptProcessorNode is deprecated but still works.
      const processor = audioContext.createScriptProcessor(
        4096,
        1,
        1
      );

      pcmDataRef.current = [];

      processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer.getChannelData(0); // Float32
        const int16Chunk = float32ToInt16(inputBuffer);
        pcmDataRef.current.push(int16Chunk);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      sourceRef.current = source;
      processorRef.current = processor;
      streamRef.current = stream;

      setRecording(true);
      console.log("🎙 Recording started. SampleRate =", audioContext.sampleRate);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not access microphone.");
    }
  }, [recording]);

  // ---------- STOP recording, make WAV, send to backend ----------
  const stopRecording = useCallback(async () => {
    if (!recording) return;
    setRecording(false);

    try {
      // Stop audio graph
      if (processorRef.current && sourceRef.current) {
        processorRef.current.disconnect();
        sourceRef.current.disconnect();
      }

      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const chunks = pcmDataRef.current;
      if (!chunks || chunks.length === 0) {
        console.log("No audio captured.");
        return;
      }

      // Merge chunks into one Int16Array
      let totalLength = 0;
      for (const ch of chunks) totalLength += ch.length;
      const result = new Int16Array(totalLength);
      let offset = 0;
      for (const ch of chunks) {
        result.set(ch, offset);
        offset += ch.length;
      }

      const sampleRate =
        audioContextRef.current?.sampleRate || 16000;
      const wavBlob = encodeWAV(result, sampleRate);

      // ---- Send WAV to backend /voice/stt ----
      const formData = new FormData();
      formData.append("file", wavBlob, "audio.wav");

      const res = await fetch("http://localhost:8000/voice/stt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Speech result =", data);

      if (data && data.text && data.text.trim().length > 0) {
        // Put it into input + auto-send
        setText((prev) =>
          prev ? prev + " " + data.text : data.text
        );
        handleSend(data.text);
      }
    } catch (err) {
      console.error("Error stopping / sending recording:", err);
    } finally {
      audioContextRef.current = null;
      sourceRef.current = null;
      processorRef.current = null;
      streamRef.current = null;
      pcmDataRef.current = [];
    }
  }, [recording, handleSend, setText]);

  // ---------- Stop TTS on Escape ----------
  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      // Spacebar toggles mic when focus is NOT inside textarea
      if (e.code === "Space" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (recording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
      // ESC stops TTS
      if (e.code === "Escape") {
        stopSpeaking();
      }
    };

    window.addEventListener("keydown", handleKeyDownGlobal);
    return () =>
      window.removeEventListener("keydown", handleKeyDownGlobal);
  }, [recording, startRecording, stopRecording, stopSpeaking]);

  // ---------- UI ----------
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
        onClick={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? "red" : "white",
          color: recording ? "white" : "black",
        }}
      >
        🎤
      </button>

      <button onClick={onOpenRight}>≡</button>
    </div>
  );
}
