import { getPlateNumberValidationSchema } from '@/helper/validation/rules';
import * as v from 'valibot';

export const AccessFormSchema = v.object({
    plateNumber: getPlateNumberValidationSchema(),
    isEmergency: v.boolean(),
});

export type AccessFormData = v.InferOutput<typeof AccessFormSchema>;
