import { checkpointService } from '@/domain/checkpoint/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: async (req, res) => {
        const result = await checkpointService.getById(req.query.checkpointId);

        return res.status(200).json({ status: true, data: result });
    },
    PATCH: async (req, res) => {
        const result = await checkpointService.update({
            id: req.query.checkpointId,
            ...req.body,
        });

        return res.status(200).json({ status: true, data: result });
    },
    DELETE: async (req, res) => {
        const result = await checkpointService.delete(req.query.checkpointId);

        return res.status(200).json({ status: true, data: result });
    },
});
