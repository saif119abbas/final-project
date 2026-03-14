import refreshTokenProfile from "@application/user/mapper/refreshToken.mapper";
import userProfile from "@application/user/mapper/user.profile";

export default function registerMappers(): void
{
    userProfile()
    refreshTokenProfile()
}