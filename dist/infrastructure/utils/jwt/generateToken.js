import jwtConfig from "@config/jwt.config";
import jwt from "jsonwebtoken";
export default function generateTokenPair(payload) {
    const accessToken = jwt.sign({ ...payload, jti: crypto.randomUUID() }, jwtConfig.accessToken.secret, {
        expiresIn: jwtConfig.accessToken.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
    });
    const refreshToken = jwt.sign({ ...payload, jti: crypto.randomUUID() }, jwtConfig.refreshToken.secret, {
        expiresIn: jwtConfig.refreshToken.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
    });
    return { accessToken, refreshToken };
}
