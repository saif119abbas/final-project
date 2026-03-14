import { TokenPayload } from "@core/interfaces/jwt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export default function verfiyToken(
  token: string,
  secret: string,
): TokenPayload | null {
  let verifyResult: string | JwtPayload;
  try {
    verifyResult = jwt.verify(token, secret);
  } catch {
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
    id: verifyResult.id,
    username:verifyResult.username,
  };

  return payload;
}
