import { Response } from "express";
import ms, { StringValue } from "ms";
export default function setCookie(refreshToken: string, res: Response,key:string): void {
    if (res) {
        res.cookie(key, refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue),
        });
    }
}
