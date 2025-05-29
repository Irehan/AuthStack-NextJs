import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

// Define interface for request body
interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

// Define interface for response body
interface SignupResponse {
    message: string;
    success: boolean;
    user: {
        id: string;
        email: string;
        username: string;
    };
}

// Define interface for user data (based on User model)
interface UserData {
    _id: string;
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    // Add other relevant fields from your User model
}

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody: SignupRequestBody = await request.json();
        const { username, email, password } = reqBody;

        // Check for existing user by both email and username
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashPassword,
        });

        const savedUser: UserData = await newUser.save();

        // Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id,
        });

        return NextResponse.json<SignupResponse>({
            message: "User created successfully",
            success: true,
            user: {
                id: savedUser._id.toString(),
                email: savedUser.email,
                username: savedUser.username,
            },
        });
    } catch (error: unknown) {
        // Handle unknown error type safely
        const errorMessage = error instanceof Error ? error.message : "Server error";
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}