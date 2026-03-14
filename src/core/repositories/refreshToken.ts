import { RefreshToken } from "@core/models/refreshToken.model";
import IRepository from "./repository";

export interface IResfreshTokenRepository extends IRepository<RefreshToken,Omit<RefreshToken, "updatedAt" | "createdAt">> {
    findByUserId(userId: string): Promise<RefreshToken|null>;
    revokedToken(token: string): Promise<boolean>;
    revokedUserTokens(userId: string): Promise<boolean>;
}
