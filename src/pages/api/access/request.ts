import { accessEventService } from '@/domain/access/service';
import { Role } from '@/domain/session';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    POST: {
        handler: async (req, res) => {
            const result = await accessEventService.request(req.body);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Operator, Role.Admin],
    },
});
