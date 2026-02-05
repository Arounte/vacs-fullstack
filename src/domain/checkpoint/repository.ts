import { db } from '@/framework/db/init';
import { type Checkpoint, checkpoints } from '@/framework/db/schema';
import { eq } from 'drizzle-orm';
import type { CreateCheckpointData, UpdateCheckpointData } from '.';

export class CheckpointRepository {
    async findAll(): Promise<Checkpoint[]> {
        const existing = await db.select().from(checkpoints);

        return existing;
    }

    async findById(id: string): Promise<Checkpoint | undefined> {
        const [existing] = await db.select().from(checkpoints).where(eq(checkpoints.id, id));

        return existing;
    }

    async create(data: CreateCheckpointData): Promise<Checkpoint | undefined> {
        return (await db.insert(checkpoints).values(data).returning())[0];
    }

    async update({ id, ...data }: UpdateCheckpointData): Promise<Checkpoint | undefined> {
        return (
            await db.update(checkpoints).set(data).where(eq(checkpoints.id, id)).returning()
        )[0];
    }

    async delete(id: string) {
        return (
            await db.delete(checkpoints).where(eq(checkpoints.id, id)).returning()
        )[0];
    }
}

export const checkpointRepository = new CheckpointRepository();
