"use client";
import Link from "next/link";
import { useState } from "react";
// API_URL is not used in this file, but leaving it in case you need it later
import { API_URL } from "../../lib/api"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If FastAPI returns validation errors
        if (data.detail) {
          // detail might be array or string
          const message = Array.isArray(data.detail)
            ? data.detail.map((d) => d.msg).join(", ")
            : data.detail;
          setError(message);
        } else {
          setError("Invalid email or password."); // More user-friendly
        }
        return;
      }

      // Login successful
      localStorage.setItem("token", data.access_token);
      setError(null);
      router.push("/chat");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    // Main container: Fills the screen, centers content
    <div className="flex min-h-[90vh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Log in to AI Tutor
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back!
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full gap-2 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-1 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span>

              <lord-icon className="py-1"
    src="https://cdn.lordicon.com/kdduutaw.json"
    trigger="loop"
    delay="1000"
    stroke="bold"
    state="hover-looking-around"
    colors="primary:#ffffff,secondary:#ffffff"
    >
</lord-icon> 
       </span>
       <span>
Log in
       </span>
               </button>
            </div>
          </form>

          {/* Sign up Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}