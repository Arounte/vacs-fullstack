import { getStringValidationSchema } from '@/helper/validation/rules';
import * as v from 'valibot';

export const CreateCheckpointSchema = v.object({
    name: getStringValidationSchema(),
});

export type CreateCheckpointData = v.InferOutput<typeof CreateCheckpointSchema>;

export const UpdateCheckpointSchema = v.intersect([
    v.object({ id: getStringValidationSchema() }),
    CreateCheckpointSchema,
]);

export type UpdateCheckpointData = v.InferOutput<typeof UpdateCheckpointSchema>;
