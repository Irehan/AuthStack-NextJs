import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

// Define interface for sendEmail parameters
interface EmailOptions {
    email: string;
    emailType: "VERIFY" | "RESET";
    userId: string;
}

// Define interface for mail options
interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        // Use consistent field names for verification and password reset
        const updateData = emailType === "VERIFY"
            ? {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000  // 1 hour
            }
            : {
                forgotPasswordToken: hashedToken,
                forgotPasswordExpiry: Date.now() + 3600000  // 1 hour
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

        const mailOptions: MailOptions = {
            from: process.env.MAIL_FROM!,
            to: email,
            subject: emailType === "VERIFY"
                ? "Verify your email"
                : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"
                } or copy and paste the link below in your browser.</p>
                   <p>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        };

        return await transport.sendMail(mailOptions);

    } catch (error: unknown) {
        // Handle unknown error type safely
        const errorMessage = error instanceof Error ? error.message : "Failed to send email";
        throw new Error(errorMessage);
    }
};