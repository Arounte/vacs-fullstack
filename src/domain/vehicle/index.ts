import {
    getPlateNumberValidationSchema,
    getStringValidationSchema,
} from '@/helper/validation/rules';
import * as v from 'valibot';

export const CreateVehicleSchema = v.object({
    plateNumber: getPlateNumberValidationSchema(),
    ownerName: getStringValidationSchema(),
    ownerPhone: getStringValidationSchema(),
    model: v.optional(v.string()),
});

export type CreateVehicleData = v.InferOutput<typeof CreateVehicleSchema>;

export const UpdateVehicleSchema = v.intersect([
    v.object({
        id: getStringValidationSchema(),
    }),
    CreateVehicleSchema,
]);

export type UpdateVehicleData = v.InferOutput<typeof UpdateVehicleSchema>;
