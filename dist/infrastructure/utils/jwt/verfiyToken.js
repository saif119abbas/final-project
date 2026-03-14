import jwt from "jsonwebtoken";
export default function verfiyToken(token, secret) {
    let verifyResult;
    try {
        verifyResult = jwt.verify(token, secret);
    }
    catch (err) {
        return null;
    }
    if (typeof verifyResult !== "object" ||
        !verifyResult ||
        !("id" in verifyResult) ||
        !("username" in verifyResult) ||
        !("name" in verifyResult)) {
        return null;
    }
    const payload = {
        id: verifyResult.id,
        username: verifyResult.username,
        name: verifyResult.name,
    };
    return payload;
}
