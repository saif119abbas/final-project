import mapper from "@application/shared/mapper/mapper";
import jwtConfig from "@config/jwt.config";
import RefreshTokenRequest from "@core/dto/refreshToken/refreshTokenRequest.dto";
import LoginRequest from "@core/dto/user/loginRequest.dto";
import LoginResponse from "@core/dto/user/LoginResponse";
import UnauthorizedError from "@core/errors/unauthorizedError";
import { TokenPair, TokenPayload } from "@core/interfaces/jwt";
import { User } from "@core/models";
import { RefreshToken } from "@core/models/refreshToken.model";
import { IResfreshTokenRepository } from "@core/repositories/refreshToken";
import { IUserRepository } from "@core/repositories/user";
import IUseCase from "@core/shared/useCase";
import ms, { StringValue } from "ms";
import { Response } from "express";

export default class LoginUseCase implements IUseCase<LoginResponse> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly refreshTokenRepository:IResfreshTokenRepository,
        private readonly generateTokenPair: (payload: TokenPayload) => TokenPair,
        private readonly compare:(password: string, hash: string)=>Promise<boolean>,
        private readonly setRefreshTokenCookie: (refreshToken: string, res: Response,key:string)=> void,
    ) {}

    async call(credentials: LoginRequest, res: Response): Promise<LoginResponse> {
        const { email, password } = credentials;
        const user:User | null=await this.userRepository.findByEmail(email)

        if (!user) {
            throw new UnauthorizedError("Invalid username or password");
        }
        const isPasswordCorrect=await this.compare(password,user.password)
         if (!isPasswordCorrect) {
            throw new UnauthorizedError("Invalid username or password");
        }
        const payload = {
            id: user.id,
            username: user.username,
            companyId: "companyId" in user ? user.companyId : undefined,
        };
        const { accessToken, refreshToken } = this.generateTokenPair(payload);
              const refreshExpiresIn = ms(jwtConfig.refreshToken.expiresIn as StringValue);
        if (!refreshExpiresIn) {
            throw new Error("JWT_REFRESH_EXPIRES_IN is not defined or invalid");
        }
        const refreshTokenRequest = Object.assign(new RefreshTokenRequest(), {
        userId: user.id,
        revokedAt: null,
        token:refreshToken,
        expiresAt: new Date(Date.now() + refreshExpiresIn),
        });
        const refrestTokenInstance=mapper.map(refreshTokenRequest,RefreshTokenRequest,RefreshToken)
        await this.refreshTokenRepository.create(refrestTokenInstance)
        this.setRefreshTokenCookie(refreshToken,res,"refreshToken")
        const response: LoginResponse = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            accessToken,
        };
        return response;
    }
}
