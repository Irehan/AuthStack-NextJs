"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

// Define interface for user state
interface UserCredentials {
    email: string;
    password: string;
    username: string;
}

// Define interface for API response
interface SignupResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
    error?: string;
}

// Define interface for Axios error response
interface AxiosErrorResponse {
    error?: string;
}

export default function SignUpPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserCredentials>({ email: "", password: "", username: "" });
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = ({ email, password, username }: UserCredentials): boolean => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 6;
        const isUsernameValid = username.length >= 3;
        return isEmailValid && isPasswordValid && isUsernameValid;
    };

    const onSignup = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post<SignupResponse>("/api/users/signup", user);

            if (response.data.success) {
                console.log("Signup Success", response.data);
                toast.success("Signup successful! Please verify your email.");
                router.push("/login");
            } else {
                setError(response.data.error || "Signup failed");
                toast.error(response.data.error || "Signup failed");
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof AxiosError
                    ? (error.response?.data as AxiosErrorResponse)?.error || error.message
                    : error instanceof Error
                        ? error.message
                        : "An unexpected error occurred";
            console.error("Signup Failed:", errorMessage);
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!validateForm(user));
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-white/5 border border-white/10">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    {loading ? "Processing..." : "Create an Account"}
                </h2>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-500 text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); onSignup(); }}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-white text-sm mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            disabled={loading}
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
                            placeholder="Create a password"
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