// src\helpers\mailer.ts
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        // FIX: Use consistent field names
        const updateData = emailType === "VERIFY"
            ? {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000  // 1 hour
            }
            : {
                forgotPasswordToken: hashedToken,
                forgotPasswordExpiry: Date.now() + 3600000  // FIXED FIELD NAME
            };

        await User.findByIdAndUpdate(userId, updateData);

        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST!,
            port: Number(process.env.MAIL_PORT!),
            secure: process.env.MAIL_SECURE === "true",
            auth: {
                user: process.env.MAIL_USER!,
                pass: process.env.MAIL_PASS!
            }
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: process.env.MAIL_FROM!,
            to: email,
            subject: emailType === "VERIFY"
                ? "Verify your email"
                : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email or copy and paste the link below in your browser.</p>
                   <p>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        };

        return await transport.sendMail(mailOptions);

    } catch (error: any) {
        throw new Error(error.message);
    }
};