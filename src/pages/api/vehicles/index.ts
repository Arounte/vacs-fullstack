import { Role } from '@/domain/session';
import { vehicleService } from '@/domain/vehicle/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (_, res) => {
            const result = await vehicleService.getAllVehicles();

            return res.json({ status: true, data: result });
        },
        roles: [Role.Operator, Role.Admin],
    },
    POST: {
        handler: async (req, res) => {
            const result = await vehicleService.create(req.body);

            return res.json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
