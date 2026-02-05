import { passService } from '@/domain/pass/service';
import { Role } from '@/domain/session';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (_, res) => {
            const result = await passService.getAllPasses();

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin, Role.Operator],
    },
    POST: {
        handler: async (req, res) => {
            const result = await passService.create(req.body);

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
