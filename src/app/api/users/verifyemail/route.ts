import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { Document } from "mongoose";

// Define interface for request body
interface VerifyEmailRequestBody {
    token: string;
}

// Define interface for response body
interface VerifyEmailResponse {
    message: string;
    success: boolean;
}

// Define minimal user document interface - remove the save method override
interface UserDocument extends Document {
    email: string;
    isVerified: boolean;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    // Remove the save method - it's inherited from Document with correct typing
}

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody: VerifyEmailRequestBody = await request.json();
        const { token } = reqBody;
        console.log("Verification token received:", token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        }) as UserDocument | null;

        if (!user) {
            console.error("Invalid or expired token:", token);
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        console.log("User found for verification:", user.email);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();
        console.log("User verified successfully:", user.email);

        return NextResponse.json<VerifyEmailResponse>({
            message: "Email verified successfully",
            success: true,
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Server error during verification";
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}