import { Role } from '@/domain/session';
import { sessionService } from '@/domain/session/service';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Handler } from './types';

export function apiAdminHandler(handler: Handler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const { role } = await sessionService.getSession(req, res);

        if (role !== Role.Admin) {
            return res.status(403).json({ status: false, reason: 'forbidden' });
        }

        return await handler(req, res);
    };
}
