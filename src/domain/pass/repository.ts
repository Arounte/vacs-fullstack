import { db } from '@/framework/db/init';
import { type Pass, type PassCreate, passes } from '@/framework/db/schema';
import { eq } from 'drizzle-orm';

export class PassRepository {
    async findAll(): Promise<Pass[]> {
        return db.select().from(passes);
    }

    async findById(id: string): Promise<Pass | undefined> {
        const [existing] = await db.select().from(passes).where(eq(passes.id, id));

        return existing;
    }

    async create(data: PassCreate): Promise<Pass | undefined> {
        return (await db.insert(passes).values(data).returning())[0];
    }

    async update({ id, ...data }: Partial<PassCreate>): Promise<Pass | undefined> {
        return (
            await db
                .update(passes)
                .set(data)
                .where(eq(passes.id, id ?? ''))
                .returning()
        )[0];
    }
}

export const passRepository = new PassRepository();
