import { TokenPayload } from "@core/interfaces/jwt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export default function verfiyToken(token: string, secret: string): TokenPayload | null {
    let verifyResult: string | JwtPayload;
    try {
        verifyResult = jwt.verify(token, secret);
    } catch (err) {
        return null;
    }

    if (
        typeof verifyResult !== "object" ||
        !verifyResult ||
        !("id" in verifyResult) ||
        !("username" in verifyResult)
    ) {
        return null;
    }
    const payload: TokenPayload = {
        id: (verifyResult as any).id,
        username: (verifyResult as any).username,
    };

    return payload;
}
