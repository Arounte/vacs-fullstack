import { db } from '@/framework/db/init';
import { type AdminSession, adminSession } from '@/framework/db/schema';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import type { CreateSessionData, UpdateSessionData } from '.';

export class SessionRepository {
    async findById(sessionId: string): Promise<AdminSession | undefined> {
        return (await db.select().from(adminSession).where(eq(adminSession.id, sessionId)))[0];
    }

    async findByUserId(userId: string): Promise<AdminSession[]> {
        return await db.select().from(adminSession).where(eq(adminSession.userId, userId));
    }

    async create(data: CreateSessionData): Promise<AdminSession | undefined> {
        return (
            await db
                .insert(adminSession)
                .values({
                    ...data,
                    expiresAt: dayjs.utc().add(1, 'month').toDate(),
                })
                .returning()
        )[0];
    }

    async update({ id, ...data }: UpdateSessionData): Promise<AdminSession | undefined> {
        return (
            await db.update(adminSession).set(data).where(eq(adminSession.id, id)).returning()
        )[0];
    }

    async delete(sid: string) {
        return db.delete(adminSession).where(eq(adminSession.id, sid));
    }
}

export const sessionRepository = new SessionRepository();
