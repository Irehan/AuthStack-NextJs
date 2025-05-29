import { NextResponse } from "next/server";

// Define interface for response body
interface LogoutResponse {
    message: string;
    success: boolean;
}

export async function GET() {
    try {
        const response = NextResponse.json<LogoutResponse>(
            {
                message: "Logout Successful",
                success: true,
            }
        );
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return response;
    } catch (error: unknown) {
        // Handle unknown error type safely
        const errorMessage = error instanceof Error ? error.message : "Server error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}