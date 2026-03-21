import UserResponse from "../../../core/dto/user/userResponse.dto";
import { User } from "../../../core/models";
import mapper from "../../shared/mapper/mapper";
import { UserRequest } from "../../../core/dto/user/userRequest.dto";
import isDatabaseError from "../../shared/db/databaseError";
import ConflictError from "../../../core/errors/conflictError";
export default class CreateUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async call(data) {
        try {
            const user = mapper.map(data, UserRequest, User);
            const result = await this.userRepository.create(user);
            return mapper.map(result, User, UserResponse);
        }
        catch (error) {
            if (isDatabaseError(error) && error.cause.code === '23505') {
                console.error("Conflict error: This user already exists.");
                throw new ConflictError("user", "email", data.email);
            }
            throw error;
        }
    }
}
