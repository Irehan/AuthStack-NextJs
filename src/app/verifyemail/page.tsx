// src\app\verifyemail\page.tsx
"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/api/users/verifyemail', { token });

            if (response.data.success) {
                setVerified(true);
                console.log("Email verified successfully");
            } else {
                setError(response.data.error || "Verification failed");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error
                || error.message
                || "Verification error";
            setError(errorMessage);
            console.error("Verification error:", errorMessage);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // FIXED: More robust token extraction
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token) {
            console.log("Token extracted from URL:", token);
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">Email Verification</h1>

            {loading && <p className="text-blue-500">Verifying...</p>}

            <div className="bg-orange-500 p-4 rounded mb-4 max-w-md">
                <p className="text-sm break-all">Token: {token || "No token found"}</p>
            </div>

            {verified && (
                <div className="text-center">
                    <h2 className="text-green-500 text-2xl mb-2">
                        ✅ Email verified successfully!
                    </h2>
                    <Link href="/login" className="text-blue-500 underline">
                        Go to Login
                    </Link>
                </div>
            )}

            {error && (
                <div className="text-center">
                    <h2 className="text-red-500 text-2xl mb-2">
                        ❌ Verification Failed
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link href="/signup" className="text-blue-500 underline">
                        Try signing up again
                    </Link>
                </div>
            )}
        </div>
    )
}