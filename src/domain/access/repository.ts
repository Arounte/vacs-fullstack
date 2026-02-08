import { db } from '@/framework/db/init';
import { type AccessEvent, type AccessEventCreate, accessEvents } from '@/framework/db/schema';
import { and, count, desc, eq } from 'drizzle-orm';

export class AccessEventRepository {
    async findAll(): Promise<AccessEvent[]> {
        return db.select().from(accessEvents);
    }

    async hasVehicleAccessEvents(checkpointId: string, plateNumber: string): Promise<boolean> {
        const { count: countValue } = (
            await db
                .select({ count: count() })
                .from(accessEvents)
                .where(
                    and(
                        eq(accessEvents.checkpointId, checkpointId),
                        eq(accessEvents.plateNumber, plateNumber),
                    ),
                )
        )[0];

        return countValue > 0;
    }

    async findLast(checkpointId: string, plateNumber: string): Promise<AccessEvent | undefined> {
        const [existing] = await db
            .select()
            .from(accessEvents)
            .where(
                and(
                    eq(accessEvents.plateNumber, plateNumber),
                    eq(accessEvents.checkpointId, checkpointId),
                    eq(accessEvents.result, 'allowed'),
                ),
            )
            .orderBy(desc(accessEvents.timestamp))
            .limit(1);

        return existing;
    }

    async findLastByPlateNumber(
        plateNumber: string,
        checkpointId: string,
    ): Promise<AccessEvent | undefined> {
        const [existing] = await db
            .select()
            .from(accessEvents)
            .where(
                and(
                    eq(accessEvents.plateNumber, plateNumber),
                    eq(accessEvents.checkpointId, checkpointId),
                ),
            )
            .orderBy(desc(accessEvents.timestamp))
            .limit(1);

        return existing;
    }

    async create(data: AccessEventCreate): Promise<AccessEvent> {
        return (await db.insert(accessEvents).values(data).returning())[0];
    }
}

export const accessEventRepository = new AccessEventRepository();
