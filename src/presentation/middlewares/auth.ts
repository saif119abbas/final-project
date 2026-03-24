import jwtConfig from "@config/jwt.config";
import UnauthorizedError from "@core/errors/unauthorizedError";
import { TokenPayload } from "@core/interfaces/jwt";
import { User } from "@core/models";
import IUseCase from "@core/shared/useCase";
import verfiyToken from "@infrastructure/utils/jwt/verfiyToken";
import { NextFunction, Response, Request } from "express";

export default class AuthenticationMiddleware {
  constructor(private readonly findUserByIdUseCase: IUseCase<User>) {}

  authentication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new UnauthorizedError("Unauthorized access");
      }
      const verifyResult = verfiyToken(token, jwtConfig.accessToken.secret);
      if (!verifyResult) {
        throw new UnauthorizedError("Unauthorized access");
      }
      const decoded = verifyResult as TokenPayload;
      const userId = decoded.id;
      const user = await this.findUserByIdUseCase.call(userId);
      req.userId = user.id;
      req.token = token;
      next();
    } catch (error) {
      next(error);
    }
  };

  verfiyRefreshToken = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      console.log();
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedError("Refresh token not found");
      }
      const verifyResult = verfiyToken(
        refreshToken,
        jwtConfig.refreshToken.secret,
      );
      if (!verifyResult) {
        throw new UnauthorizedError("Refresh token not found");
      }
      const payload = verifyResult as TokenPayload;
      const userId = payload.id;
      const user = await this.findUserByIdUseCase.call(userId);
      if (!user) {
        throw new UnauthorizedError("User not found");
      }
      req.token = refreshToken;
      req.userId = userId;
      next();
    };
  };
}
