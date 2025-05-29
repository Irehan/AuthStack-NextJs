// src\helpers\getDataFromToken.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        // First check Authorization header
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
            return decodedToken.id;
        }

        // Fallback to cookie check
        const token = request.cookies.get("token")?.value || "";
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;

    } catch (error: any) {
        throw new Error(error.message);
    }
}