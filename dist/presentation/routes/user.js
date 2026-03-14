import CreateUserUseCase from "@application/user/commands/create.usecase";
import UserRepository from "@infrastructure/repositories/user.repository";
import UserController from "@presentation/controllers/user.controller";
export default class UserRouter {
    app;
    controller;
    constructor(app) {
        this.app = app;
        const userRepository = new UserRepository();
        const createUserUseCase = new CreateUserUseCase(userRepository);
        this.controller = new UserController(createUserUseCase);
        this.registerEndpoints();
    }
    registerEndpoints() {
        this.app.use("/api/users");
        this.app.post("", this.controller.createUser.bind(this.controller));
    }
}
