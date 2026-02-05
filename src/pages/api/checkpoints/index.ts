import { checkpointService } from '@/domain/checkpoint/service';
import { Role } from '@/domain/session';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (_, res) => {
            const result = await checkpointService.getAllCheckpoints();

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin, Role.Operator],
    },
    POST: {
        handler: async (req, res) => {
            const result = await checkpointService.create(req.body);

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
