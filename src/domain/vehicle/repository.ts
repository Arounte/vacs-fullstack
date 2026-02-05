import { db } from '@/framework/db/init';
import { type Vehicle, vehicles } from '@/framework/db/schema';
import { eq } from 'drizzle-orm';
import type { CreateVehicleData, UpdateVehicleData } from '.';

export class VehicleRepository {
    async findAll(): Promise<Vehicle[]> {
        const existing = await db.select().from(vehicles);

        return existing;
    }

    async findById(id: string): Promise<Vehicle | undefined> {
        const [existing] = await db.select().from(vehicles).where(eq(vehicles.id, id));

        return existing;
    }

    async create(data: CreateVehicleData): Promise<Vehicle | undefined> {
        return (await db.insert(vehicles).values(data).returning())[0];
    }

    async update({ id, ...data }: UpdateVehicleData): Promise<Vehicle | undefined> {
        return (await db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning())[0];
    }
}

export const vehicleRepository = new VehicleRepository();
