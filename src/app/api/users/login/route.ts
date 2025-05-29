import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define interfaces for type safety
interface LoginRequestBody {
    email: string;
    password: string;
}

interface TokenData {
    id: string;
    username: string;
    email: string;
}

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody: LoginRequestBody = await request.json();
        const { email, password } = reqBody;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User does not exist" },
                { status: 400 }
            );
        }

        // Check email verification
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email not verified. Please check your email for verification instructions."
                },
                { status: 401 }
            );
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 400 }
            );
        }

        // Create token data
        const tokenData: TokenData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        };

        // Create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d"
        });

        const response = NextResponse.json({
            success: true,
            message: "Login Successful",
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400 // 1 day
        });

        return response;

    } catch (error: unknown) {
        // Handle unknown error type safely
        const errorMessage = error instanceof Error ? error.message : "Server error";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}