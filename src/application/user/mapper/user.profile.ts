import "reflect-metadata";
import { createMap, forMember, ignore } from "@automapper/core";
import UserRequest from "@core/dto/user/userRequest.dto";
import { User } from "@core/models/user.model";
import mapper from "@application/shared/mapper/mapper";
import UserResponse from "@core/dto/user/userResponse.dto";
export default function userProfile(): void {
  createMap(
    mapper,
    UserRequest,
    User,
    forMember((dest) => dest.id, ignore()),
    forMember((dest) => dest.createdAt, ignore()),
    forMember((dest) => dest.updatedAt, ignore()),
  );
  createMap(mapper, User, UserResponse);
}
