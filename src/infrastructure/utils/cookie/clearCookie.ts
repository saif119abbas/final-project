import { Response } from "express";
export default function clearCookie( res: Response,key:string): void {
    if (res) {
         res.clearCookie(key, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    }
}
