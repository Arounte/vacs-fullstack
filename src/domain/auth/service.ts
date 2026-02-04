import ApiError from '@/framework/backend/apiError';
import { verify } from 'argon2';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { AUTH_FORM_VALIDATION_SCHEMA } from '.';
import type { Session } from '../session';
import { type SessionService, sessionService } from '../session/service';
import { type UserRepository, userRepository } from '../user/repository';
import { type AuthRepository, authRepository } from './repository';

export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly sessionService: SessionService,
    ) {}

    async login(req: NextApiRequest, res: NextApiResponse): Promise<Session | never> {
        const result = v.safeParse(AUTH_FORM_VALIDATION_SCHEMA, req.body);
        if (!result.success) {
            throw Error('validation_error');
        }

        const { username, password } = result.output;

        const user = await this.authRepository.findByName(username);
        if (!user) {
            throw new ApiError('password_not_valid_or_user_not_found');
        }

        if (!user.isActive) {
            throw new ApiError('password_not_valid_or_user_not_found');
        }

        const isValid = await verify(user.password, password);
        if (!isValid) {
            throw new ApiError('password_not_valid_or_user_not_found');
        }

        await this.userRepository.update({
            id: user.id,
            lastLoginAt: new Date(),
        });

        return this.sessionService.setSession(req, res, user, true);
    }
}

export const authService = new AuthService(authRepository, userRepository, sessionService);
