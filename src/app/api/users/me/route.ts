import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

// Define interface for user data
interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
}

// Define interface for response body
interface UserResponse {
    message: string;
    data: UserData | null;
}

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({ _id: userId })
            .select("_id username email isVerified");

        if (!user) {
            return NextResponse.json(
                { message: "User not found", data: null },
                { status: 404 }
            );
        }

        // Manually convert to plain object with string _id
        const userData: UserData = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
        };

        return NextResponse.json<UserResponse>({
            message: "User Found",
            data: userData
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Server error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 400 }
        );
    }
}