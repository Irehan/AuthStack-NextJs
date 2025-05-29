// src\app\login\page.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onLogin = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await axios.post("/api/users/login", user);

            if (response.data.success) {
                toast.success("Login successful");
                router.push("/profile");
            } else {
                setError(response.data.error || "Login failed");
                toast.error(response.data.error || "Login failed");
            }
        } catch (error: any) {
            // Handle different types of errors
            const errorMessage = error.response?.data?.error ||
                error.message ||
                "An unexpected error occurred";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
        const isPasswordValid = user.password.length >= 6;
        setButtonDisabled(!(isEmailValid && isPasswordValid));
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-white/5 border border-white/10">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    {loading ? "Processing..." : "Welcome Back"}
                </h2>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-500 text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white text-sm mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-white text-sm mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            disabled={loading}
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 rounded-xl font-semibold transition ${buttonDisabled || loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/forgotpassword"
                        className="text-blue-400 hover:underline text-sm"
                    >
                        Forgot password?
                    </Link>
                </div>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-400 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}