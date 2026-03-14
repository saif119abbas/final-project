import { Request, NextFunction, Response } from "express";  // ← explicit import
import  UserRequest  from "@core/dto/user/userRequest.dto";
import UserResponse from "@core/dto/user/userResponse.dto";
import IUseCase from "@core/shared/useCase";
import { created, ok } from "@presentation/http/responses/successResponse";
import LoginResponse from "@core/dto/user/LoginResponse";
import LoginRequest from "@core/dto/user/loginRequest.dto";

export default class UserController {
    constructor(
        private readonly createUserUseCase: IUseCase<UserResponse>,
        private readonly loginUseCase: IUseCase<LoginResponse>,
        private readonly logoutUseCase: IUseCase<boolean>,
        private readonly refreshTokenUseCase: IUseCase<string>,
    ) {}

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user: UserRequest = req.body;
            const data: UserResponse = await this.createUserUseCase.call(user);
            created(res, {
                message: "User created successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    };
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const credentails: LoginRequest = req.body;
            const data: LoginResponse = await this.loginUseCase.call(credentails,res);
            ok(res, {
                message: "User logged in successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    };
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await this.logoutUseCase.call(req.userId!,req.token!,res);
            ok(res, {
                message: "User logged in successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    };
    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {userId,token}=req
            const accessToken = await this.refreshTokenUseCase.call(userId,token,res);
            ok(res, {
                message: "User logged in successfully",
                data:{
                    token:accessToken
                },
            });
        } catch (error) {
            next(error);
        }
    };
}