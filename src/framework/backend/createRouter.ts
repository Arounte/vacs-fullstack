import type { NextApiRequest, NextApiResponse } from 'next';
import type ApiError from './apiError';
import type { REST, Routes } from './types';

export function createRouter(routes: Routes) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const handler = routes[(req.method as REST) || ''];

        if (!handler) {
            return res.status(405).json({ status: false, reason: 'method_not_allowed' });
        }

        try {
            return await handler(req, res);
        } catch (error) {
            console.error(error);

            return res.status(500).json({ status: false, reason: (error as ApiError).reason ?? 'internal_server_error' });
        }
    };
}
