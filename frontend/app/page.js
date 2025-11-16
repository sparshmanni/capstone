"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push("/chat");
    }, 10);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-8 rounded-3xl shadow-xl mx-6 my-10 relative overflow-hidden">
      
      {/* Background Accent Shapes */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-0 w-52 h-52 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      
      {/* Hero Section */}
      <div className="relative max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent animate-fade-in drop-shadow-sm">
          Welcome to <span className="underline decoration-wavy decoration-indigo-500">AI Tutor</span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 leading-relaxed animate-fade-in-delay max-w-2xl mx-auto">
          Your inclusive AI-powered assistant 🤖 — designed for 
          <span className="font-semibold text-indigo-600"> everyone</span>, including those who are 
          <span className="underline"> visually impaired</span> and 
          <span className="underline"> nonverbal</span>. 
        </p>
      </div>

      {/* Call-to-Action */}
      <div className="mt-10 animate-fade-in-up">
        <Link
          href="/chat"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transform transition"
        >
          🚀 Get Started
        </Link>
      </div>
    </div>
  );
}
