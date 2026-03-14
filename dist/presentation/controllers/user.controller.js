import { created } from "@presentation/http/responses/successResponse";
export default class UserController {
    createUserUseCase;
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    createUser = async (req, res, next) => {
        try {
            const user = req.body;
            const data = await this.createUserUseCase.call(user);
            created(res, {
                message: "User created successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
