import Repository from "./repository";
import { db } from "@infrastructure/db";
import { eq, and, isNull, gt, desc } from "drizzle-orm";
import { refreshTokens } from "@infrastructure/db/schema/refreshToken.schema";
import { IResfreshTokenRepository } from "@core/repositories/refreshToken";
import { RefreshToken } from "@core/models/refreshToken.model";

export default class RefreshTokenRepository
  extends Repository<typeof refreshTokens>
  implements IResfreshTokenRepository
{
  constructor() {
    super(refreshTokens);
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const [result] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, userId),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(refreshTokens.createdAt))
      .limit(1);

    return result ?? null;
  }

  async revokedToken(token: string): Promise<boolean> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const result = await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt)),
      )
      .returning({ id: refreshTokens.id });

    return result.length > 0;
  }

  async revokedUserTokens(userId: string): Promise<boolean> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const result = await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)),
      )
      .returning({ id: refreshTokens.id });

    return result.length > 0;
  }
}
