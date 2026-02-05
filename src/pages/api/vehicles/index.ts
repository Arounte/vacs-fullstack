import { vehicleService } from '@/domain/vehicle/service';
import { createRouter } from '@/framework/backend/createRouter';

export default createRouter({
    GET: async (_, res) => {
        const result = await vehicleService.getAllVehicles();

        return res.json({ status: true, data: result });
    },
    POST: async (req, res) => {
        const result = await vehicleService.create(req.body);

        return res.json({ status: true, data: result });
    },
});
