import UnauthorizedError from "@core/errors/unauthorizedError";
import { TokenPayload } from "@core/interfaces/jwt";
import jwt from "jsonwebtoken";

export default function verifyToken(token: string): TokenPayload {
  // Verify token and get payload
  const decoded = jwt.decode(token);

  if (
    !decoded ||
    typeof decoded !== "object" ||
    !("id" in decoded) ||
    !("username" in decoded)
  ) {
    throw new UnauthorizedError("Invalid token");
  }
  const payload: TokenPayload = {
    id: (decoded as any).id,
    username: (decoded as any).username,
  };

  return payload;
}
