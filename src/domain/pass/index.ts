import { getStringValidationSchema } from '@/helper/validation/rules';
import * as v from 'valibot';

export const CreatePassSchema = v.object({
    vehicleId: getStringValidationSchema(),
    checkpointId: getStringValidationSchema(),
    validFrom: v.pipe(v.string(), v.isoTimestamp()),
    validTo: v.pipe(v.string(), v.isoTimestamp()),
});

export type CreatePassData = v.InferOutput<typeof CreatePassSchema>;

export const UpdatePassSchema = v.object({
    id: getStringValidationSchema(),
    isActive: v.optional(v.boolean()),
    vehicleId: v.optional(getStringValidationSchema()),
    checkpointId: v.optional(getStringValidationSchema()),
    validFrom: v.optional(v.pipe(v.string(), v.isoTimestamp())),
    validTo: v.optional(v.pipe(v.string(), v.isoTimestamp())),
});

export type UpdatePassData = v.InferOutput<typeof UpdatePassSchema>;
