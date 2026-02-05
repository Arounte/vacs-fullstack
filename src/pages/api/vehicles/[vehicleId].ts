import { Role } from '@/domain/session';
import { vehicleService } from '@/domain/vehicle/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: {
        handler: async (req, res) => {
            const result = await vehicleService.getById(req.query.vehicleId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Operator, Role.Admin],
    },
    PATCH: {
        handler: async (req, res) => {
            const result = await vehicleService.update({
                id: req.query.vehicleId,
                ...req.body,
            });

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
    DELETE: {
        handler: async (req, res) => {
            const result = await vehicleService.delete(req.query.vehicleId);

            return res.status(200).json({ status: true, data: result });
        },
        roles: [Role.Admin],
    },
});
