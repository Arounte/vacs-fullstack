import { getStringValidationSchema } from '@/helper/validation/rules';
import * as v from 'valibot';

export const PassFormSchema = v.object({
    vehicleId: getStringValidationSchema(),
    checkpointId: getStringValidationSchema(),
    validFrom: v.date(),
    validTo: v.date(),
    isActive: v.boolean(),
});

export type PassFormData = v.InferOutput<typeof PassFormSchema>;
