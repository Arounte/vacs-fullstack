import { checkpointService } from '@/domain/checkpoint/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: async (_, res) => {
        const result = await checkpointService.getAllCheckpoints();

        return res.json({ status: true, data: result });
    },
    POST: async (req, res) => {
        const result = await checkpointService.create(req.body);

        return res.json({ status: true, data: result });
    },
});
