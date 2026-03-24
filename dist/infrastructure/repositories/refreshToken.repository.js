"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = __importDefault(require("./repository"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const refreshToken_schema_1 = require("../db/schema/refreshToken.schema");
class RefreshTokenRepository extends repository_1.default {
    constructor() {
        super(refreshToken_schema_1.refreshTokens);
    }
    async findByUserId(userId) {
        const [result] = await db_1.db
            .select()
            .from(refreshToken_schema_1.refreshTokens)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(refreshToken_schema_1.refreshTokens.userId, userId), (0, drizzle_orm_1.isNull)(refreshToken_schema_1.refreshTokens.revokedAt), (0, drizzle_orm_1.gt)(refreshToken_schema_1.refreshTokens.expiresAt, new Date())))
            .orderBy((0, drizzle_orm_1.desc)(refreshToken_schema_1.refreshTokens.createdAt))
            .limit(1);
        return result ?? null;
    }
    async revokedToken(token) {
        const result = await db_1.db
            .update(refreshToken_schema_1.refreshTokens)
            .set({
            revokedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(refreshToken_schema_1.refreshTokens.token, token), (0, drizzle_orm_1.isNull)(refreshToken_schema_1.refreshTokens.revokedAt)))
            .returning({ id: refreshToken_schema_1.refreshTokens.id });
        return result.length > 0;
    }
    async revokedUserTokens(userId) {
        const result = await db_1.db
            .update(refreshToken_schema_1.refreshTokens)
            .set({
            revokedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(refreshToken_schema_1.refreshTokens.userId, userId), (0, drizzle_orm_1.isNull)(refreshToken_schema_1.refreshTokens.revokedAt)))
            .returning({ id: refreshToken_schema_1.refreshTokens.id });
        return result.length > 0;
    }
}
exports.default = RefreshTokenRepository;
