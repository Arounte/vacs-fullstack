import { db } from '@/framework/db/init';
import { type Pass, type PassCreate, passes } from '@/framework/db/schema';
import { and, count, eq, gte, lte } from 'drizzle-orm';

export class PassRepository {
    async findAll(): Promise<Pass[]> {
        return db.select().from(passes);
    }

    async findById(id: string): Promise<Pass | undefined> {
        const [existing] = await db.select().from(passes).where(eq(passes.id, id));

        return existing;
    }

    async findValid(
        checkpointId: string,
        vehicleId: string,
        timestamp: Date,
    ): Promise<Pass | undefined> {
        const [existing] = await db
            .select()
            .from(passes)
            .where(
                and(
                    eq(passes.checkpointId, checkpointId),
                    eq(passes.isActive, true),
                    eq(passes.vehicleId, vehicleId),
                    lte(passes.validFrom, timestamp),
                    gte(passes.validTo, timestamp),
                ),
            );

        return existing;
    }

    async hasOverlap(
        vehicleId: string,
        checkpointId: string,
        validFrom: Date,
        validTo: Date,
    ): Promise<boolean> {
        const [{ count: value }] = await db
            .select({ count: count() })
            .from(passes)
            .where(
                and(
                    eq(passes.vehicleId, vehicleId),
                    eq(passes.checkpointId, checkpointId),
                    eq(passes.isActive, true),
                    lte(passes.validFrom, validTo),
                    gte(passes.validTo, validFrom),
                ),
            );

        return value > 0;
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
