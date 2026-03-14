import ForbiddenError from "@core/errors/forbiddenError";
import UnauthorizedError from "@core/errors/unauthorizedError";
import { TokenPayload } from "@core/interfaces/jwt";
import { IResfreshTokenRepository } from "@core/repositories/refreshToken";
import IUseCase from "@core/shared/useCase";
import { Response } from "express";
export default class LogoutUseCase implements IUseCase<boolean> {
    constructor(
        private readonly refreshTokenRepository: IResfreshTokenRepository,
        private readonly decodeToken: (token: string) => TokenPayload,
        private readonly clearRefreshTokenCookie:(res:Response,key:string)=>void
    ) {}

    async call(userId:string,token:string,res:Response): Promise<boolean> {
        if (!token) {
            throw new UnauthorizedError("Invalid token");
        }
        const payload: TokenPayload = this.decodeToken(token);
        if (!payload) {
            throw new UnauthorizedError("Invalid token");
        }
        console.log("from logout", payload)
        if(userId!==payload.id)
        {
            throw new ForbiddenError("Not allowed to use another token");
        }
        const result = await this.refreshTokenRepository.revokedUserTokens(userId);
        if (!result) {
            throw new UnauthorizedError("Failed to logout");
        }
        this.clearRefreshTokenCookie(res,"refreshToken")
        return true;
    }
}
