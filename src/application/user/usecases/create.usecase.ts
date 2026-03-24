import IUseCase from "@core/shared/useCase";
import { IUserRepository } from "@core/repositories/user";
import UserResponse from "@core/dto/user/userResponse.dto";
import { User } from "@core/models";
import mapper from "@application/shared/mapper/mapper";
import UserRequest from "@core/dto/user/userRequest.dto";
import isDatabaseError from "@application/shared/db/databaseError";
import ConflictError from "@core/errors/conflictError";

export default class CreateUserUseCase implements IUseCase<UserResponse> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptPassword: (password: string) => string,
  ) {}

  async call(data: UserRequest): Promise<UserResponse> {
    try {
      const user: User = mapper.map(data, UserRequest, User);
      user.password = this.encryptPassword(data.password);
      const result = await this.userRepository.create(user);
      return mapper.map(result, User, UserResponse);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.cause.code === "23505") {
        console.error("Conflict error: This user already exists.");
        throw new ConflictError("user", "email", data.email);
      }
      throw error;
    }
  }
}
