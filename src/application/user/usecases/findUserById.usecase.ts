import NotFoundError from "@core/errors/notFoundError";
import { User } from "@core/models";
import { IUserRepository } from "@core/repositories/user";
import IUseCase from "@core/shared/useCase";

export default class FindUserByIdUseCase implements IUseCase<User> {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async call(userId: string): Promise<User> {
    const user: User | null = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
