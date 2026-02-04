import type { AdminSession, AdminUser } from '@/framework/db/schema';
import { getIronSession, type IronSession } from 'iron-session';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Role, type Session, SESSION_OPTIONS } from '.';
import { type UserRepository, userRepository } from '../user/repository';
import { type SessionRepository, sessionRepository } from './repository';

export class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userRepository: UserRepository,
    ) {}

    private async session(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
    ): Promise<IronSession<Session>> {
        return getIronSession<Session>(req, res, SESSION_OPTIONS);
    }

    async getSession(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<Session> {
        const session = await this.session(req, res);
        const { sid, id, username, role } = session;
        const hasSession = !!id && !!sid && !!username && !!role;
        if (!hasSession) {
            throw Error('session_expired');
        }

        const existingSession = await this.sessionRepository.findById(sid);
        if (!existingSession) {
            await this.destroySession(req, res);
            throw Error('session_expired');
        }

        const { username: newUsername, role: newRole } = await this.userRepository.findById(id);
        const { ip, ua } = this.getMeta(req);

        await this.sessionRepository.update({
            id: existingSession.id,
            lastActivityAt: new Date(),
            ipAddress: ip,
            userAgent: ua,
        });

        if (username !== newUsername || role !== newRole) {
            session.username = newUsername;
            session.role = newRole as Role;

            await session.save();
        }

        return session;
    }

    async setSession(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
        data: AdminUser,
        isInit = false,
    ): Promise<Session> {
        const { id, username, role } = data;
        const session = await this.session(req, res);

        if (isInit) {
            const { ip, ua } = this.getMeta(req);

            const newSession = await this.sessionRepository.create({
                userId: id,
                ipAddress: ip,
                userAgent: ua,
            });

            if (!newSession) throw Error('set_session_error');
            session.sid = newSession.id;
        }

        session.id = id;
        session.username = username;
        session.role = role as Role;

        await session.save();

        return session;
    }

    async destroySession(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        const session = await this.session(req, res);

        session.destroy();
    }

    async destroySessionById(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
        sid: string,
    ) {
        const session = await this.session(req, res);
        const existing = await this.sessionRepository.findById(sid);
        if (!existing || (existing.userId !== session.id && session.role !== Role.Admin)) {
            throw new Error('forbidden');
        }

        return this.sessionRepository.delete(sid);
    }

    async getSessionsByUserId(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
        userId: string,
    ): Promise<AdminSession[]> {
        const session = await this.session(req, res);
        if (session.id !== userId && session.role !== Role.Admin) {
            throw new Error('forbidden');
        }

        return this.sessionRepository.findByUserId(userId);
    }

    private getMeta(req: IncomingMessage): {
        ip: string;
        ua: string;
    } {
        const ip = req.headers['x-forwarded-for'] || (req.socket.address() as AddressInfo).address;
        const ua = req.headers['user-agent'] ?? '';

        return {
            ip: Array.isArray(ip) ? ip[0] : ip,
            ua,
        };
    }
}

export const sessionService = new SessionService(sessionRepository, userRepository);
