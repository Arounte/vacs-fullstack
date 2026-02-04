import { sessionService } from '@/domain/session/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    DELETE: async (req, res) => {
        const { sessionId } = req.query;
        if (!sessionId) return res.status(404);

        await sessionService.destroySessionById(req, res, sessionId as string);

        return res.status(200).json({ status: true });
    },
});
