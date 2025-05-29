import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Define interface for response body
interface UserResponse {
    message: string;
    data: object | null;
}

// Define interface for user data (based on typical User model structure)
interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    // Add other relevant fields from your User model
}

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return NextResponse.json<UserResponse>(
                { message: "User not found", data: null },
                { status: 404 }
            );
        }
        return NextResponse.json<UserResponse>({
            message: "User Found",
            data: user
        });
    } catch (error: unknown) {
        // Handle unknown error type safely
        const errorMessage = error instanceof Error ? error.message : "Server error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 400 }
        );
    }
}