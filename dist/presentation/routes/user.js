"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_usecase_1 = __importDefault(require("../../application/user/usecases/create.usecase"));
const user_repository_1 = __importDefault(require("../../infrastructure/repositories/user.repository"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const userCreate_1 = require("../../application/user/validation/userCreate");
const encryptPassword_1 = __importDefault(require("../../infrastructure/utils/encryption/encryptPassword"));
const login_usecase_1 = __importDefault(require("../../application/user/usecases/login.usecase"));
const refreshToken_repository_1 = __importDefault(require("../../infrastructure/repositories/refreshToken.repository"));
const generateToken_1 = __importDefault(require("../../infrastructure/utils/jwt/generateToken"));
const decodeToken_1 = __importDefault(require("../../infrastructure/utils/jwt/decodeToken"));
const comparePasswords_1 = __importDefault(require("../../infrastructure/utils/encryption/comparePasswords"));
const login_1 = require("../../application/user/validation/login");
const logout_usecase_1 = __importDefault(require("../../application/user/usecases/logout.usecase"));
const refreshToken_usecase_1 = __importDefault(require("../../application/user/usecases/refreshToken.usecase"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const setCookie_1 = __importDefault(require("../../infrastructure/utils/cookie/setCookie"));
const clearCookie_1 = __importDefault(require("../../infrastructure/utils/cookie/clearCookie"));
const findUserById_usecase_1 = __importDefault(require("../../application/user/usecases/findUserById.usecase"));
class UserRouter {
    constructor(app) {
        this.app = app;
        // ============================================================================
        // DEPENDENCY INJECTION SETUP
        // ============================================================================
        const userRepository = new user_repository_1.default();
        const refreshTokenRepository = new refreshToken_repository_1.default();
        // ============================================================================
        // USECASES
        // ============================================================================
        const createUserUseCase = new create_usecase_1.default(userRepository, encryptPassword_1.default);
        const loginUsecase = new login_usecase_1.default(userRepository, refreshTokenRepository, generateToken_1.default, comparePasswords_1.default, setCookie_1.default);
        const logoutUsecase = new logout_usecase_1.default(refreshTokenRepository, decodeToken_1.default, clearCookie_1.default);
        const refreshTokenUsecase = new refreshToken_usecase_1.default(refreshTokenRepository, decodeToken_1.default, generateToken_1.default, decodeToken_1.default, setCookie_1.default, clearCookie_1.default);
        const findUserByIdUsecase = new findUserById_usecase_1.default(userRepository);
        // ============================================================================
        // CONTROLLERS
        // ============================================================================
        this.authMiddleWare = new auth_1.default(findUserByIdUsecase);
        this.controller = new user_controller_1.default(createUserUseCase, loginUsecase, logoutUsecase, refreshTokenUsecase);
        this.router = (0, express_1.Router)();
        this.registerEndpoints();
    }
    registerEndpoints() {
        this.app.use("/api/users", this.router);
        this.router.post("/", (0, validate_1.default)(userCreate_1.UserRequestSchema), this.controller.createUser.bind(this.controller));
        this.router.post("/login", (0, validate_1.default)(login_1.LoginSchema), this.controller.login.bind(this.controller));
        this.router.post("/logout", this.authMiddleWare.verfiyRefreshToken(), this.controller.logout.bind(this.controller));
        this.router.post("/refresh-token", this.authMiddleWare.verfiyRefreshToken(), this.controller.refreshToken.bind(this.controller));
    }
}
exports.default = UserRouter;
