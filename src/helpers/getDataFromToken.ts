import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define interface for JWT payload
interface TokenPayload {
    id: string;
    username: string;
    email: string;
}

export const getDataFromToken = (request: NextRequest): string => {
    try {
        // First check Authorization header
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;
            return decodedToken.id;
        }

        // Fallback to cookie check
        const token = request.cookies.get("token")?.value || "";
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;
        return decodedToken.id;

    } catch (error: unknown) {
        // Handle unknown error type safely
        const errorMessage = error instanceof Error ? error.message : "Invalid or expired token";
        throw new Error(errorMessage);
    }
};