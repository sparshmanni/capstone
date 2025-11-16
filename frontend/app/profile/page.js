"use client";
import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUser() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Failed to load profile. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Session Expired</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-2 px-6">
      <div className="max-w-4xl mx-auto">
       

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-2 px-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex gap-5 items-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                👤
              </div>
              <div className="flex flex-col items-center">

                <h2 className="text-3xl font-bold ">
                  {user.username || "Student"}
                </h2>
                <p className="text-blue-100 text-lg">
                  {user.email || "No email provided"}
                </p>
              </div>
              </div>
                <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/chat')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>💬</span>
                Start Learning
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Account Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600">👤</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Username</p>
                        <p className="font-semibold text-gray-800">
                          {user.username || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600">📧</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-semibold text-gray-800">
                          {user.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600">📅</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-semibold text-gray-800">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Learning Statistics
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-blue-100 text-sm">Chat Sessions</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-2xl font-bold">0h</div>
                    <div className="text-green-100 text-sm">Learning Time</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-purple-100 text-sm">Topics Covered</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-orange-100 text-sm">Achievements</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}