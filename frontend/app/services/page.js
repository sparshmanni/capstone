"use client";
import React from "react";

export default function ServicesPage() {
  const services = [
    {
      icon: "🤖",
      title: "AI Chatbot Tutor",
      description: "Our AI chatbot, powered by Perplexity API (Sonar model), helps students ask academic and general questions with natural, conversational interactions. The chatbot remembers your session and provides factual, grounded answers to guide learning.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔐",
      title: "User Authentication",
      description: "Secure login and signup ensure personalized study sessions. Your chat history, preferences, and session data remain private and accessible only to you.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🎤",
      title: "Voice Interaction",
      description: "Speak your questions using Speech-to-Text and listen to AI responses via Text-to-Speech. This creates an interactive, hands-free learning experience ideal for revision and quick queries.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: "👐",
      title: "Sign Language Interpreter",
      description: "A machine-learning based sign language interpreter converts hand gestures into text in real time. This feature makes the platform accessible for users with hearing or speech impairments.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: "⚡",
      title: "FastAPI Backend",
      description: "A high-speed FastAPI backend manages authentication, chatbot queries, session storage, and voice processing with efficient performance and scalability.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: "💻",
      title: "Modern & Responsive Frontend",
      description: "The frontend is built using React.js and Tailwind CSS, providing a clean, fast, and mobile-friendly interface. Students can chat, speak, or use gestures seamlessly.",
      gradient: "from-gray-700 to-gray-900"
    }
  ];

  const futureFeatures = [
    "Multi-language support for global accessibility",
    "AI-generated quizzes and assessments after lessons",
    "Automated session summary converted into study notes",
    "Expanded gesture dataset for improved sign recognition",
    "Smart quick prompts like 'Explain with example'",
    "Personalized study recommendations based on learning patterns",
    "Advanced progress tracking and learning analytics",
    "Collaborative learning features and group sessions"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Comprehensive Learning
            <span className="block bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
              Services & Features
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover our suite of AI-powered tools designed to make learning accessible, 
            interactive, and personalized for every student.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
              ⚙️
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Technology Stack</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "React.js", desc: "Frontend Framework", emoji: "⚛️" },
              { name: "Tailwind CSS", desc: "Styling & Design", emoji: "🎨" },
              { name: "FastAPI", desc: "Backend Framework", emoji: "🐍" },
              { name: "Perplexity AI", desc: "AI Chat Model", emoji: "🧠" }
            ].map((tech, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="text-3xl mb-2">{tech.emoji}</div>
                <h4 className="font-semibold text-gray-800">{tech.name}</h4>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Features */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
              🚀
            </div>
            <h2 className="text-3xl font-bold">Coming Soon - Future Upgrades</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {futureFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0 group-hover:bg-white/30 transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-indigo-100 leading-relaxed group-hover:text-white transition-colors">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience Next-Gen Learning?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join our platform today and unlock the full potential of AI-powered education 
              with accessibility features for everyone.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                Start Learning Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}