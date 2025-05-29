"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define interface for API response
interface VerifyEmailResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export default function VerifyEmailPage() {
    const [token, setToken] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post<VerifyEmailResponse>('/api/users/verifyemail', { token });

            if (response.data.success) {
                setVerified(true);
                console.log("Email verified successfully");
            } else {
                setError(response.data.error || "Verification failed");
            }
        } catch (error: unknown) {
            // Handle different types of errors
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : (error as any).response?.data?.error || "Verification error";
            setError(errorMessage);
            console.error("Verification error:", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Extract token from URL query parameters
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
    );
}