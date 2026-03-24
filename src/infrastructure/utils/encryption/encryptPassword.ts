import bcrypt from "bcryptjs";

export default function encryptPassword(password: string): string {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}
