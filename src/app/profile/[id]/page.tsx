// src\app\profile\[id]\page.tsx
import Link from "next/link";

export default async function UserProfile({ params }: { params: { id: string } }) {
    // ✅ Dummy await to satisfy Next.js 15 async param handling
    await Promise.resolve();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-white/5 border border-white/10 text-white text-center">
                <h1 className="text-3xl font-bold mb-4">👤 User Profile</h1>
                <p className="text-gray-300 mb-4">Welcome to your unique profile page.</p>

                <div className="text-xl mb-6">
                    <span className="text-gray-400 mr-2">User ID:</span>
                    <span className="inline-block px-4 py-2 rounded-xl bg-orange-500 text-black font-mono break-all">
                        {params.id}
                    </span>
                </div>

                <Link
                    href="/profile"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
                >
                    ← Back to Profile
                </Link>
            </div>
        </div>
    );
}
