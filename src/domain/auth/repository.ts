import { db } from '@/framework/db/init';
import { adminUser, type AdminUser } from '@/framework/db/schema';
import { eq } from 'drizzle-orm';

export class AuthRepository {
    async findById(id: string): Promise<AdminUser | undefined> {
        const [existing] = await db
            .select()
            .from(adminUser)
            .where(eq(adminUser.id, id));

        return existing;
    }

    async findByName(username: string): Promise<AdminUser | undefined> {
        const [existing] = await db
            .select()
            .from(adminUser)
            .where(eq(adminUser.username, username));

        return existing;
    }
}

export const authRepository = new AuthRepository();
