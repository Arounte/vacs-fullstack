import type { AdminUser } from '@/framework/db/schema';
import argon2 from 'argon2';
import * as v from 'valibot';
import { CreateUserSchema, UpdateUserSchema } from '.';
import { type UserRepository, userRepository } from './repository';
import ApiError from '@/framework/backend/apiError';

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getAllUsers(): Promise<AdminUser[]> {
        return this.userRepository.findAll();
    }

    async getById(id?: string | string[]): Promise<AdminUser> {
        if (!id) throw new ApiError('empty_id');

        return this.userRepository.findById(Array.isArray(id) ? id[0] : id);
    }

    async create(data: unknown) {
        const result = v.parse(CreateUserSchema, data);
        const hash = await argon2.hash(result.password);

        return this.userRepository.create({
            ...result,
            password: hash,
        });
    }

    async update(data: unknown) {
        const result = v.parse(UpdateUserSchema, data);
        const hash = result.password ? await argon2.hash(result.password) : undefined;

        return this.userRepository.update({
            ...result,
            password: hash,
        });
    }
}

export const userService = new UserService(userRepository);
