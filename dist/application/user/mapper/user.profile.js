import "reflect-metadata";
import { createMap, forMember, ignore } from "@automapper/core";
import { UserRequest } from "@core/dto/user/userRequest.dto";
import { User } from "@core/models/user.model";
import mapper from "@application/shared/mapper/mapper";
export default function userProfile() {
    createMap(mapper, UserRequest, User, forMember((dest) => dest.id, ignore()), forMember((dest) => dest.createdAt, ignore()), forMember((dest) => dest.updatedAt, ignore()));
}
