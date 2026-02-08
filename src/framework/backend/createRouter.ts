import { sessionService } from '@/domain/session/service';
import type { NextApiRequest, NextApiResponse } from 'next';
import type ApiError from './apiError';
import type { REST, Routes } from './types';

export function createRouter(routes: Routes) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const route = routes[req.method as REST];

        if (!route) {
            return res.status(405).json({ status: false, reason: 'method_not_allowed' });
        }

        try {
            const config =
                typeof route === 'function' ? { handler: route, roles: undefined } : route;
            let user: { id: string; username: string } | undefined;

            if (config.roles && config.roles.length > 0) {
                const { id, username, role } = await sessionService.getSession(req, res);
                user = {
                    id,
                    username,
                };

                if (!config.roles.includes(role)) {
                    return res.status(403).json({ status: false, reason: 'forbidden' });
                }
            }

            return await config.handler(req, res, user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                reason: (error as ApiError).reason ?? 'internal_server_error',
            });
        }
    };
}
