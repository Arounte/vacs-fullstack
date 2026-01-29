import { verify } from 'argon2';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';
import { AUTH_FORM_VALIDATION_SCHEMA, type AuthForm } from '.';
import type { Session } from '../session';
import { type SessionService, sessionService } from '../session/service';
import { type AuthRepository, authRepository } from './repository';

export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly sessionService: SessionService,
    ) {}

    async login(req: NextApiRequest, res: NextApiResponse): Promise<Session | never> {
        try {
            // const { username, password } = req.body as AuthForm;

            const result = v.safeParse(AUTH_FORM_VALIDATION_SCHEMA, req.body as AuthForm);
            if (!result.success) {
                throw Error('validation_error');
            }

            const { username, password } = result.output;

            const user = await this.authRepository.findByName(username);
            if (!user) {
                throw Error('password_not_valid_or_user_not_found');
            }

            const isValid = await verify(user.password, password);
            if (!isValid) {
                throw Error('password_not_valid_or_user_not_found');
            }

            return this.sessionService.setSession(req, res, user, true);
        } catch (error) {
            throw Error((error as Error).message);
        }
    }
}

export const authService = new AuthService(authRepository, sessionService);
