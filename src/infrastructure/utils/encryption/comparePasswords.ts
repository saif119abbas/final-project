import bcrypt from "bcryptjs";

export default async function compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
