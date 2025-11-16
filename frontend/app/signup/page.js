"use client";
import Link from "next/link";
import { useState } from "react";
import { API_URL } from "../../lib/api";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify"; // <-- ADDED
import "react-toastify/dist/ReactToastify.css"; // <-- ADDED

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(""); // <-- REMOVED

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError(""); // <-- REMOVED

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // <-- ADDED
        toast.success("Account created! Redirecting to login..."); 
        router.push("/login"); // redirect to login after signup
      } else {
        // Handle validation errors from backend
        let errorMessage = "Signup failed"; // <-- Default message
        if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((d) => d.msg).join(", ");
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        toast.error(errorMessage); // <-- REPLACED setError
      }
    } catch (err) {
      toast.error("Network error. Try again."); // <-- REPLACED setError
    }
  };

  return (
    // Main container: Fills the screen, centers content
    <div className="flex min-h-[90vh] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      {/* Container for all toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="colored"
      /> {/* <-- ADDED */}

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Get started with AI Tutor
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  autoComplete="new-password" // Use "new-password" for signup
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message -- REMOVED */}
            {/* {error && (
              <div className="text-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
            */}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full gap-2 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-1 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span>
                  <lord-icon
                    className="py-1"
                    src="https://cdn.lordicon.com/vjgknpfx.json"
                    trigger="loop"
                    delay="2500"
                    stroke="bold"
                    state="hover-swirl"
                    colors="primary:#ffffff,secondary:#ffffff"
                  ></lord-icon>
                </span>

                <span>Create account</span>
              </button>
            </div>
          </form>

          {/* Log in Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}