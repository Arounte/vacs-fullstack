import { userService } from '@/domain/user/service';
import { apiAdminHandler } from '@/framework/backend/apiAdminHandler';
import { createRouter } from '@/framework/backend/createRouter';

export default apiAdminHandler(
    createRouter({
        GET: async (_, res) => {
            const result = await userService.getAllUsers();

            return res.json({ status: true, data: result });
        },
        POST: async (req, res) => {
            const result = await userService.create(req.body);

            return res.json({ status: true, data: result });
        },
    }),
);
