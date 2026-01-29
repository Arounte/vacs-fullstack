import { db } from '@/framework/db/init';
import { type AdminUser, adminUser } from '@/framework/db/schema';
import { eq } from 'drizzle-orm';
import type { CreateUserData, UpdateUserData } from '.';

export class UserRepository {
    async findAll(): Promise<AdminUser[]> {
        const existing = await db.select().from(adminUser);

        return existing;
    }

    async findById(id: string): Promise<AdminUser> {
        const [existing] = await db.select().from(adminUser).where(eq(adminUser.id, id));

        return existing;
    }

    async create(data: CreateUserData): Promise<AdminUser | undefined> {
        return (
            await db
                .insert(adminUser)
                .values({
                    ...data,
                    role: data.role as string,
                })
                .returning()
        )[0];
    }

    async update({ id, ...data }: UpdateUserData): Promise<AdminUser | undefined> {
        return (
            await db
                .update(adminUser)
                .set({ ...data, role: data.role as string })
                .where(eq(adminUser.id, id))
                .returning()
        )[0];
    }
}

export const userRepository = new UserRepository();
