// src\app\api\users\signup\route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody;

        // Check for existing user by both email and username
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
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
            password: hashPassword
        });

        const savedUser = await newUser.save();

        // Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id  // <-- Fixed parameter name
        });

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username
            }
        });

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}