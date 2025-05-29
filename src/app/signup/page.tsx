// src\app\signup\page.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "", username: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup Success", response.data);
            toast.success("Signup successful!");
            router.push("/login");
        } catch (error: any) {
            console.error("Signup Failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const { email, password, username } = user;
        setButtonDisabled(!(email && password && username));
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-white/5 border border-white/10">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    {loading ? "Processing..." : "Create an Account"}
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); onSignup(); }}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-white text-sm mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white text-sm mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-white text-sm mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Create a password"
                            className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
