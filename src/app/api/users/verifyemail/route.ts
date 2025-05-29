// src\app\api\users\verifyemail\route.ts
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log("Verification token received:", token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            console.error("Invalid or expired token:", token);
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        console.log("User found for verification:", user.email);

        // FIXED TYPO HERE: isVerfied -> isVerified
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();
        console.log("User verified successfully:", user.email);

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: error.message || "Server error during verification" },
            { status: 500 }
        );
    }
}