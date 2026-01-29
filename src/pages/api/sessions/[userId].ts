import { sessionService } from '@/domain/session/service';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: false, reason: 'method_not_allowed ' });
    }

    const { userId } = req.query;
    if (!userId) {
        return res.status(404);
    }

    try {
        const result = await sessionService.getSessionsByUserId(req, res, userId as string);

        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        return res.status(200).json({ status: false, reason: (error as Error).message });
    }
}
