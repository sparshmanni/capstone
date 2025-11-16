"use client";
import React from "react";

export default function AboutPage() {
  const features = [
    {
      icon: "🎓",
      title: "AI-Powered Learning",
      description: "Natural and conversational learning with an intelligent AI tutor that adapts to your learning style."
    },
    {
      icon: "🎤",
      title: "Voice Interaction",
      description: "Speak your questions and receive audio responses for hands-free learning experience."
    },
    {
      icon: "👐",
      title: "Sign Language Support",
      description: "Real-time sign language interpreter making education accessible for hearing- and speech-impaired users."
    },
    {
      icon: "⚡",
      title: "Fast & Scalable",
      description: "Lightweight platform that delivers instant responses and scales to meet growing educational needs."
    }
  ];

  const objectives = [
    "Provide natural and conversational learning with an AI tutor",
    "Offer secure authentication for personalized study sessions",
    "Enable voice-based query input and audio responses",
    "Include real-time sign language interpreter for accessibility",
    "Ensure the system is fast, lightweight, and scalable"
  ];

  const futureVision = [
    "Multi-language support for global accessibility",
    "Expanded gesture datasets for sign language",
    "Automatic quizzes and assessment tools",
    "Personalized study notes and session summaries",
    "Advanced learning analytics and progress tracking"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Revolutionizing Education with
            <span className="block bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
              AI & Accessibility
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            An intelligent, accessible, and interactive learning platform designed to support 
            every student in their academic journey through cutting-edge AI technology.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            💡 Innovative Learning Platform
          </div>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            The <strong className="text-blue-600">AI-Based Student Assistant System</strong> integrates 
            modern AI tools including smart chatbots, voice interaction, and real-time sign language 
            interpretation, creating an inclusive environment for all types of learners.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Objectives Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
              🎯
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Objectives</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Value Proposition */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🌟</span>
            <h2 className="text-3xl font-bold">What Makes Us Unique?</h2>
          </div>
          <p className="text-lg text-purple-100 leading-relaxed max-w-3xl">
            Our platform seamlessly blends advanced AI with comprehensive accessibility features. 
            Whether you're typing questions, speaking them aloud, or using hand gestures, 
            the system intelligently understands and responds, creating a truly inclusive 
            learning environment for everyone.
          </p>
        </div>

        {/* Future Vision */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              🚀
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Vision for the Future</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureVision.map((vision, index) => (
              <div key={index} className="flex items-center gap-3 group hover:translate-x-2 transition-transform">
                <span className="text-blue-500 text-lg">→</span>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {vision}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Learning Experience?</h3>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already benefiting from our AI-powered, 
              accessible learning platform.
            </p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}