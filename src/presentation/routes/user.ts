import { Express, Router } from "express";
import CreateUserUseCase from "@application/user/usecases/create.usecase";
import UserRepository from "@infrastructure/repositories/user.repository";
import UserController from "@presentation/controllers/user.controller";
import validate from "@presentation/middlewares/validate";
import { UserRequestSchema } from "@application/user/validation/userCreate";
import encryptPassword from "@infrastructure/utils/encryption/encryptPassword";
import LoginUseCase from "@application/user/usecases/login.usecase";
import RefreshTokenRepository from "@infrastructure/repositories/refreshToken.repository";
import generateTokenPair from "@infrastructure/utils/jwt/generateToken";
import decodeToken from "@infrastructure/utils/jwt/decodeToken";
import compare from "@infrastructure/utils/encryption/comparePasswords";
import { LoginSchema } from "@application/user/validation/login";
import LogoutUseCase from "@application/user/usecases/logout.usecase";
import RefreshTokenUseCase from "@application/user/usecases/refreshToken.usecase";
import AuthenticationMiddleware from "@presentation/middlewares/auth";
import setCookie from "@infrastructure/utils/cookie/setCookie";
import clearCookie from "@infrastructure/utils/cookie/clearCookie";
import FindUserByIdUseCase from "@application/user/usecases/findUserById.usecase";
export default class UserRouter {
  private readonly controller: UserController;
  private readonly authMiddleWare: AuthenticationMiddleware;
  private readonly router: Router;
  constructor(private readonly app: Express) {
    // ============================================================================
    // DEPENDENCY INJECTION SETUP
    // ============================================================================
    const userRepository = new UserRepository();
    const refreshTokenRepository = new RefreshTokenRepository();

    // ============================================================================
    // USECASES
    // ============================================================================
    const createUserUseCase = new CreateUserUseCase(
      userRepository,
      encryptPassword,
    );
    const loginUsecase = new LoginUseCase(
      userRepository,
      refreshTokenRepository,
      generateTokenPair,
      compare,
      setCookie,
    );
    const logoutUsecase = new LogoutUseCase(
      refreshTokenRepository,
      decodeToken,
      clearCookie,
    );
    const refreshTokenUsecase = new RefreshTokenUseCase(
      refreshTokenRepository,
      decodeToken,
      generateTokenPair,
      decodeToken,
      setCookie,
      clearCookie,
    );
    const findUserByIdUsecase = new FindUserByIdUseCase(userRepository);
    // ============================================================================
    // CONTROLLERS
    // ============================================================================
    this.authMiddleWare = new AuthenticationMiddleware(findUserByIdUsecase);
    this.controller = new UserController(
      createUserUseCase,
      loginUsecase,
      logoutUsecase,
      refreshTokenUsecase,
    );
    this.router = Router();
    this.registerEndpoints();
  }

  private registerEndpoints() {
    this.app.use("/api/users", this.router);
    this.router.post(
      "/",
      validate(UserRequestSchema),
      this.controller.createUser.bind(this.controller),
    );
    this.router.post(
      "/login",
      validate(LoginSchema),
      this.controller.login.bind(this.controller),
    );
    this.router.post(
      "/logout",
      this.authMiddleWare.verfiyRefreshToken(),
      this.controller.logout.bind(this.controller),
    );
    this.router.post(
      "/refresh-token",
      this.authMiddleWare.verfiyRefreshToken(),
      this.controller.refreshToken.bind(this.controller),
    );
  }
}
