"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define interface for user data
interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
}

// Define interface for logout API response
interface LogoutResponse {
    success: boolean;
    message: string;
    error?: string;
}

// Define interface for get user details API response
interface UserDetailsResponse {
    message: string;
    data: UserData | null;
    error?: string;
}

// Define interface for Axios error response
interface AxiosErrorResponse {
    error?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState<string>("nothing");

    const logout = async () => {
        try {
            const response = await axios.get<LogoutResponse>("/api/users/logout");
            if (response.data.success) {
                toast.success("Logout successful");
                router.push("/login");
            } else {
                toast.error(response.data.error || "Logout failed");
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof AxiosError
                    ? (error.response?.data as AxiosErrorResponse)?.error || error.message
                    : error instanceof Error
                        ? error.message
                        : "An unexpected error occurred";
            console.error("Logout Failed:", errorMessage);
            toast.error(errorMessage);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get<UserDetailsResponse>("/api/users/me");
            if (res.data.data) {
                console.log("User Details:", res.data);
                setData(res.data.data._id);
            } else {
                toast.error(res.data.error || "No user data found");
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof AxiosError
                    ? (error.response?.data as AxiosErrorResponse)?.error || error.message
                    : error instanceof Error
                        ? error.message
                        : "Failed to fetch user details";
            console.error("Get User Details Failed:", errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-white/5 border border-white/10 text-white text-center">
                <h1 className="text-3xl font-bold mb-6">👤 Profile Page</h1>

                <p className="text-gray-300 mb-6">Welcome to your profile dashboard.</p>

                <div className="mb-6">
                    <h2 className="text-sm mb-1 text-gray-400">User ID</h2>
                    <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-blue-400 font-mono break-all">
                        {data === "nothing" ? "No data loaded yet" : (
                            <Link href={`/profile/${data}`} className="hover:underline">
                                {data}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={getUserDetails}
                        className="py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold"
                    >
                        Load User Details
                    </button>
                    <button
                        onClick={logout}
                        className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}