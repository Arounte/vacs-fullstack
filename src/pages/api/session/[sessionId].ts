import { sessionService } from '@/domain/session/service';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { sessionId } = req.query;
        if (!sessionId) return res.status(404);

        try {
            await sessionService.destroySessionById(req, res, sessionId as string);

            return res.status(200).json({ status: true });
        } catch (error) {
            return res.status(200).json({ status: false, reason: (error as Error).message });
        }
    }
}
