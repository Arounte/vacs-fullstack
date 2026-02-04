import { sessionService } from '@/domain/session/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: async (req, res) => {
        const { userId } = req.query;
        if (!userId) {
            return res.status(404);
        }

        const result = await sessionService.getSessionsByUserId(req, res, userId as string);

        return res.status(200).json({ status: true, data: result });
    },
});
