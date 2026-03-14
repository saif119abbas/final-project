import bcrypt from "bcryptjs";
export default async function compare(password, hash) {
    return bcrypt.compare(password, hash);
}
