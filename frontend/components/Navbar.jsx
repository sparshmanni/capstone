"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const optionsDate = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const dateStr = now.toLocaleDateString([], optionsDate);
      const timeStr = now.toLocaleTimeString([], optionsTime);

      setDateTime(`${dateStr} — ${timeStr}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-[72px] sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 shadow-sm">
      <nav className="max-w-8xl  mx-auto h-full px-10 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
        >
          AI Tutor
        </Link>

        {/* Date & Time */}
        <div className="text-gray-800 font-medium tracking-wide bg-white/70 px-4 py-2 rounded-xl shadow-sm">
          {dateTime}
        </div>
      </nav>
    </header>
  );
}
