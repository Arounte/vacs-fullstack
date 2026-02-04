import { userService } from '@/domain/user/service';
import { apiAdminHandler } from '@/framework/backend/apiAdminHandler';
import { createRouter } from '@/framework/backend/createRouter';

export default apiAdminHandler(
    createRouter({
        GET: async (req, res) => {
            const result = await userService.getById(req.query.userId);

            return res.status(200).json({ status: true, data: result });
        },
        PATCH: async (req, res) => {
            const result = await userService.update({
                id: req.query.userId,
                ...req.body,
            });

            return res.status(200).json({ status: true, data: result });
        },
    }),
);
