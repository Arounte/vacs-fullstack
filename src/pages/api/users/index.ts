import { Role } from '@/domain/session';
import { userService } from '@/domain/user/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (_, res) => {
            const result = await userService.getAllUsers();

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
    POST: {
        handler: async (req, res) => {
            const result = await userService.create(req.body);

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
