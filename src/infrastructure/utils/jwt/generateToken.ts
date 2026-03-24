import jwtConfig from "@config/jwt.config";
import { TokenPayload, TokenPair } from "@core/interfaces/jwt";

import jwt from "jsonwebtoken";

export default function generateTokenPair(payload: TokenPayload): TokenPair {
  const accessToken = jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    jwtConfig.accessToken.secret,
    {
      expiresIn: jwtConfig.accessToken.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    } as jwt.SignOptions,
  );

  const refreshToken = jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    jwtConfig.refreshToken.secret,
    {
      expiresIn: jwtConfig.refreshToken.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    } as jwt.SignOptions,
  );

  return { accessToken, refreshToken };
}
