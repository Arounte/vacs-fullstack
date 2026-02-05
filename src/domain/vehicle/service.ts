import ApiError from '@/framework/backend/apiError';
import type { Vehicle } from '@/framework/db/schema';
import * as v from 'valibot';
import { CreateVehicleSchema, UpdateVehicleSchema } from '.';
import { type VehicleRepository, vehicleRepository } from './repository';

export class VehicleService {
    constructor(private readonly vehicleRepository: VehicleRepository) {}

    async getAllVehicles(): Promise<Vehicle[]> {
        return this.vehicleRepository.findAll();
    }

    async getById(id?: string | string[]): Promise<Vehicle | undefined> {
        if (!id) throw new ApiError('empty_id');

        const existing = await this.vehicleRepository.findById(Array.isArray(id) ? id[0] : id);
        if (!existing) throw new Error('vehicle_not_found');

        return existing;
    }

    async create(data: unknown) {
        const result = v.parse(CreateVehicleSchema, data);

        return this.vehicleRepository.create(result);
    }

    async update(data: unknown) {
        const result = v.parse(UpdateVehicleSchema, data);

        return this.vehicleRepository.update(result);
    }

    async delete(id?: string | string[]) {
        if (!id) throw new ApiError('empty_id');

        const existing = this.vehicleRepository.delete(Array.isArray(id) ? id[0] : id);
        if (!existing) throw new Error('vehicle_not_found');

        return existing;
    }
}

export const vehicleService = new VehicleService(vehicleRepository);
