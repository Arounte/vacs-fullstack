import { Role } from '@/domain/session';
import { userService } from '@/domain/user/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (req, res) => {
            const result = await userService.getById(req.query.userId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
    PATCH: {
        handler: async (req, res) => {
            const result = await userService.update({
                id: req.query.userId,
                ...req.body,
            });

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
