import { checkpointService } from '@/domain/checkpoint/service';
import { Role } from '@/domain/session';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (req, res) => {
            const result = await checkpointService.getById(req.query.checkpointId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin, Role.Operator],
    },
    PATCH: {
        handler: async (req, res) => {
            const result = await checkpointService.update({
                id: req.query.checkpointId,
                ...req.body,
            });

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
    DELETE: {
        handler: async (req, res) => {
            const result = await checkpointService.delete(req.query.checkpointId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
