import { vehicleService } from '@/domain/vehicle/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: async (req, res) => {
        const result = await vehicleService.getById(req.query.vehicleId);

        return res.status(200).json({ status: true, data: result });
    },
    PATCH: async (req, res) => {
        const result = await vehicleService.update({
            id: req.query.vehicleId,
            ...req.body,
        });

        return res.status(200).json({ status: true, data: result });
    },
    DELETE: async (req, res) => {
        const result = await vehicleService.delete(req.query.vehicleId);

        return res.status(200).json({ status: true, data: result });
    },
});
