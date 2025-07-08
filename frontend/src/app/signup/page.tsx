"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = process.env.NEXT_PUBLIC_DEPLOYED_URL + "/auth/register";
    setError("");
   
    console.log(url);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      setError("Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_DEPLOYED_URL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition font-semibold" type="submit">
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGoogleSignup}
          className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 p-2 rounded flex items-center justify-center gap-2 transition font-semibold"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.09 30.13 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.09 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.59C43.98 37.09 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.29c-1.13-3.29-1.13-6.85 0-10.14l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 39.91l7.98-6.2z"/><path fill="#EA4335" d="M24 44c6.13 0 11.64-2.09 15.85-5.68l-7.19-5.59c-2.01 1.35-4.6 2.17-8.66 2.17-6.44 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.71 42.18 14.82 48 24 48z"/></g></svg>
          Sign Up with Google
        </button>
        <div className="mt-6 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
}
