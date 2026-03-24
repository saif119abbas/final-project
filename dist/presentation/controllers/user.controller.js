"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse_1 = require("../http/responses/successResponse");
class UserController {
    constructor(createUserUseCase, loginUseCase, logoutUseCase, refreshTokenUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.loginUseCase = loginUseCase;
        this.logoutUseCase = logoutUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.createUser = async (req, res, next) => {
            try {
                const user = req.body;
                const data = await this.createUserUseCase.call(user);
                (0, successResponse_1.created)(res, {
                    message: "User created successfully",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const credentails = req.body;
                const data = await this.loginUseCase.call(credentails, res);
                (0, successResponse_1.ok)(res, {
                    message: "User logged in successfully",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                const data = await this.logoutUseCase.call(req.userId, req.token, res);
                (0, successResponse_1.ok)(res, {
                    message: "User logged in successfully",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.refreshToken = async (req, res, next) => {
            try {
                const { userId, token } = req;
                const accessToken = await this.refreshTokenUseCase.call(userId, token, res);
                (0, successResponse_1.ok)(res, {
                    message: "User logged in successfully",
                    data: {
                        token: accessToken,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = UserController;
