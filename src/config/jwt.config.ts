
type Token={
    secret:string,
    expiresIn:string,
}
type JWTConfig = {
  accessToken:Token,
  refreshToken:Token,
  issuer:string,
  audience:string
};
const jwtConfig :JWTConfig= {
    accessToken: {
        secret: (process.env.JWT_SECRET || "") as string,
        expiresIn: (process.env.JWT_EXPIRES_IN || "30m") as string,
    },
    refreshToken: {
        secret: (process.env.JWT_REFRESH_SECRET || "") as string,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "15d") as string,
    },
    issuer: "provider-api" as string,
    audience: "provider-client" as string,
};

if (!jwtConfig.accessToken.secret || !jwtConfig.refreshToken.secret) {
    throw new Error("JWT secrets must be configured in environment variables");
}

if (jwtConfig.accessToken.secret.length < 32 || jwtConfig.refreshToken.secret.length < 32) {
    throw new Error("JWT secrets must be at least 32 characters long");
}

export default jwtConfig;
