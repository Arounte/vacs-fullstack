import { passService } from '@/domain/pass/service';
import { Role } from '@/domain/session';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (req, res) => {
            const result = await passService.getById(req.query.passId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin, Role.Operator],
    },
    PATCH: {
        handler: async (req, res) => {
            const result = await passService.update({
                id: req.query.passId,
                ...req.body,
            });

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
    DELETE: {
        handler: async (req, res) => {
            const result = await passService.delete(req.query.passId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    }
});
