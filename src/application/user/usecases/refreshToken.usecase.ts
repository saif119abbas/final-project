import mapper from "@application/shared/mapper/mapper";
import jwtConfig from "@config/jwt.config";
import RefreshTokenRequest from "@core/dto/refreshToken/refreshTokenRequest.dto";
import ForbiddenError from "@core/errors/forbiddenError";
import UnauthorizedError from "@core/errors/unauthorizedError";
import { TokenPayload,TokenPair } from "@core/interfaces/jwt";
import { RefreshToken } from "@core/models/refreshToken.model";
import { IResfreshTokenRepository } from "@core/repositories/refreshToken";
import IUseCase from "@core/shared/useCase";
import ms , {StringValue} from "ms";
import { Response } from "express";
export default class RefreshTokenUseCase implements IUseCase<string> {
    constructor(
        private readonly refreshTokenRepository: IResfreshTokenRepository,
        private readonly verifyToken: (token: string, secret: string) => TokenPayload,
        private readonly generateTokenPair: (payload: TokenPayload) => TokenPair,
          private readonly decodeToken: (token: string) => TokenPayload,
        private readonly setRefreshTokenCookie: (refreshToken: string, res: Response,key:string)=> void,
        private readonly clearRefreshTokenCookie:(res:Response,key:string)=>void
    ) {}

    async call(userId:string,token:string,res: Response): Promise<string> {
        if(!userId || !token)
        {
            throw new UnauthorizedError("You should include access token")
        }
        const tokenPayload = this.decodeToken(token);
        if (tokenPayload === null) {
            throw new ForbiddenError("Forbidden");
        }
      if(!userId || userId!==tokenPayload.id)
      {
        throw new UnauthorizedError("You should include access token")
      }
        const refreshToken = await this.refreshTokenRepository.findByUserId(userId)
        if (!refreshToken) {
            throw new ForbiddenError("The user is logged out");
        }
        const payload = this.verifyToken(refreshToken.token, jwtConfig.refreshToken.secret);
        if (
            payload === null ||
            payload.id !==userId
        ) {
            throw new ForbiddenError("You should use your token");
        }
        const tokenPair = this.generateTokenPair(payload);
        const refreshExpiresIn = ms(jwtConfig.refreshToken.expiresIn as StringValue);
        if (!refreshExpiresIn) {
            throw new Error("JWT_REFRESH_EXPIRES_IN is not defined or invalid");
        }
        const refreshTokenRequest = Object.assign(new RefreshTokenRequest(), {
        userId,
        revokedAt: null,
        token:tokenPair.refreshToken,
        expiresAt: new Date(Date.now() + refreshExpiresIn),
        });
          this.clearRefreshTokenCookie(res,"refreshToken")
        this.setRefreshTokenCookie(tokenPair.refreshToken,res,"refreshToken")
        
        const refrestTokenInstance=mapper.map(refreshTokenRequest,RefreshTokenRequest,RefreshToken)
        await this.refreshTokenRepository.create(refrestTokenInstance)
        return tokenPair.accessToken;
    }
}
