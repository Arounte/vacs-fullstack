import type { AdminUser } from '@/framework/db/schema';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { Role } from '../session';
import { type SessionService, sessionService } from '../session/service';
import { type UserRepository, userRepository } from './repository';

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionService: SessionService,
    ) {}

    async getAllUsers(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ): Promise<AdminUser[]> {
        const { role } = await this.sessionService.getSession(req, res);
        if (role !== Role.Admin) {
            throw new Error('forbidden');
        }

        return this.userRepository.findAll();
    }
}

export const userService = new UserService(userRepository, sessionService);
