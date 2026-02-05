import ApiError from '@/framework/backend/apiError';
import { db } from '@/framework/db/init';
import { type Pass, passes } from '@/framework/db/schema';
import dayjs from 'dayjs';
import { and, eq, gte, lte } from 'drizzle-orm';
import * as v from 'valibot';
import { CreatePassSchema, UpdatePassSchema } from '.';
import { type PassRepository, passRepository } from './repository';

export class PassService {
    constructor(private readonly passRepository: PassRepository) {}

    async getAllPasses(): Promise<Pass[]> {
        return this.passRepository.findAll();
    }

    async getById(id?: string | string[]): Promise<Pass | undefined> {
        if (!id) throw new ApiError('empty_id');

        const existing = this.passRepository.findById(Array.isArray(id) ? id[0] : id);
        if (!existing) throw new ApiError('pass_not_found');

        return existing;
    }

    async create(data: unknown): Promise<Pass | undefined> {
        const result = v.parse(CreatePassSchema, data);
        const [isOverlappingPassExists] = await db
            .select()
            .from(passes)
            .where(
                and(
                    eq(passes.vehicleId, result.vehicleId),
                    eq(passes.checkpointId, result.checkpointId),
                    eq(passes.isActive, true),
                    lte(passes.validFrom, new Date(result.validTo)),
                    gte(passes.validTo, new Date(result.validFrom)),
                ),
            );
        if (isOverlappingPassExists) {
            throw new ApiError('overlapping_pass_exists');
        }

        return this.passRepository.create({
            ...result,
            validFrom: new Date(result.validFrom),
            validTo: new Date(result.validTo),
        });
    }

    async update(data: unknown): Promise<Pass | undefined> {
        const result = v.parse(UpdatePassSchema, data);
        const existing = await this.getById(result.id);
        if (result.validFrom) {
            const isValid =
                dayjs().isBefore(existing?.validFrom) ||
                dayjs(result.validFrom).isSame(existing?.validFrom);
            if (!isValid) {
                throw new ApiError('invalid_valid_from_field');
            }
        }

        return this.passRepository.update({
            ...result,
            validFrom: result.validFrom ? new Date(result.validFrom) : undefined,
            validTo: result.validTo ? new Date(result.validTo) : undefined,
        });
    }
}

export const passService = new PassService(passRepository);
