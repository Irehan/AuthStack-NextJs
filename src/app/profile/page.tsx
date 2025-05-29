// src\app\profile\page.tsx
"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/users/me");
            console.log(res.data);
            setData(res.data.data._id);
        } catch (error: any) {
            toast.error("Failed to fetch user details");
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
