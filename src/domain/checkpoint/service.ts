import ApiError from '@/framework/backend/apiError';
import type { Checkpoint } from '@/framework/db/schema';
import * as v from 'valibot';
import { CreateCheckpointSchema, UpdateCheckpointSchema } from '.';
import { type CheckpointRepository, checkpointRepository } from './repository';

export class CheckpointService {
    constructor(private readonly checkpointRepository: CheckpointRepository) {}

    async getAllCheckpoints(): Promise<Checkpoint[]> {
        return this.checkpointRepository.findAll();
    }

    async getById(id?: string | string[]): Promise<Checkpoint | undefined> {
        if (!id) throw new ApiError('empty_id');

        const existing = this.checkpointRepository.findById(Array.isArray(id) ? id[0] : id);
        if (!existing) throw new ApiError('checkpoint_not_found');

        return existing;
    }

    async create(data: unknown): Promise<Checkpoint | undefined> {
        const result = v.parse(CreateCheckpointSchema, data);

        return this.checkpointRepository.create(result);
    }

    async update(data: unknown): Promise<Checkpoint | undefined> {
        const result = v.parse(UpdateCheckpointSchema, data);

        return this.checkpointRepository.update(result);
    }

    async delete(id?: string | string[]) {
        if (!id) throw new ApiError('empty_id');

        const existing = this.checkpointRepository.delete(Array.isArray(id) ? id[0] : id);
        if (!existing) throw new ApiError('checkpoint_not_found');

        return existing;
    }
}

export const checkpointService = new CheckpointService(checkpointRepository);
