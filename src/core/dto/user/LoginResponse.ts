import UserResponse from "./userResponse.dto";

export default class LoginResponse {
  user!: UserResponse;
  accessToken!: string;
}
