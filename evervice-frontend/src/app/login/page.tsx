"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
        // Trigger a force reload or state synchronization
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to reach the server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#faf7f1] text-[#242424] px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif font-black tracking-tight text-[#242424] hover:opacity-85 transition">
            ServEase
          </Link>
          <p className="text-[#6b6258] mt-2 text-xs uppercase tracking-wider">Welcome back! Please login to your account.</p>
        </div>

        <div className="bg-white border border-[#e8dfd2] p-10 rounded-none w-full shadow-none">
          <h1 className="text-xl font-serif font-semibold mb-6 text-center text-[#242424] uppercase tracking-wider">
            Login
          </h1>

          {error && (
            <div className="bg-[#faf7f1] border border-[#e8dfd2] text-rose-700 text-xs p-3.5 rounded-none mb-5 flex items-start gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="glass-input w-full px-4 py-3 rounded-none text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none"
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="glass-input w-full px-4 py-3 rounded-none text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none"
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#242424] hover:bg-[#3a3a3a] text-white font-semibold py-4 rounded-none mt-6 transition duration-200 text-xs uppercase tracking-wider active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-xs text-center mt-6 text-[#6b6258] uppercase tracking-wider">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#c99a24] hover:underline font-semibold transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}