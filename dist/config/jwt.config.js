const jwtConfig = {
    accessToken: {
        secret: (process.env.JWT_SECRET || ""),
        expiresIn: (process.env.JWT_EXPIRES_IN || "30m"),
    },
    refreshToken: {
        secret: (process.env.JWT_REFRESH_SECRET || ""),
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "15d"),
    },
    issuer: "provider-api",
    audience: "provider-client",
};
if (!jwtConfig.accessToken.secret || !jwtConfig.refreshToken.secret) {
    throw new Error("JWT secrets must be configured in environment variables");
}
if (jwtConfig.accessToken.secret.length < 32 || jwtConfig.refreshToken.secret.length < 32) {
    throw new Error("JWT secrets must be at least 32 characters long");
}
export default jwtConfig;
