import UnauthorizedError from "@core/errors/unauthorizedError";
import jwt from "jsonwebtoken";
export default function verifyToken(token) {
    // Verify token and get payload
    const decoded = jwt.decode(token);
    if (!decoded ||
        typeof decoded !== "object" ||
        !("id" in decoded) ||
        !("username" in decoded) ||
        !("name" in decoded)) {
        throw new UnauthorizedError("Invalid token");
    }
    const payload = {
        id: decoded.id,
        username: decoded.username,
        name: decoded.name,
    };
    return payload;
}
