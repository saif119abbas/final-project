import "reflect-metadata";
import { createMap, forMember, ignore, mapFrom } from "@automapper/core";
import mapper from "@application/shared/mapper/mapper"
import RefreshTokenRequest from "@core/dto/refreshToken/refreshTokenRequest.dto";
import { RefreshToken } from "@core/models/refreshToken.model";
export default function refreshTokenProfile(): void {
  createMap(
    mapper,
    RefreshTokenRequest,
    RefreshToken,     
    forMember((dest) => dest.id, ignore()),         
    forMember((dest) => dest.createdAt, ignore()), 
    forMember((dest) => dest.updatedAt, ignore()),
    forMember((dest) => dest.revokedAt, mapFrom((src) => src.revokedAt)),
    forMember((dest) => dest.expiresAt, mapFrom((src) => src.expiresAt ?? null)),
  );
}
