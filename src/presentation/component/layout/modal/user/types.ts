import {
    getEmailValidationSchema,
    getNewPasswordValidationSchema,
    getRoleValidationSchema,
    getUsernameValidationSchema,
} from '@/helper/validation/rules';
import * as v from 'valibot';

export function getPasswordSchema(isCreate: boolean) {
    if (isCreate) {
        return getNewPasswordValidationSchema();
    } else {
        return v.union([v.literal(''), getNewPasswordValidationSchema()]);
    }
}

export function getUserFormSchema(isCreate: boolean) {
    return v.object({
        username: getUsernameValidationSchema(),
        email: getEmailValidationSchema(),
        password: getPasswordSchema(isCreate),
        role: getRoleValidationSchema(),
        defaultCheckpointId: v.optional(v.string()),
        isActive: v.boolean(),
    });
}

export type UserFormData = v.InferOutput<ReturnType<typeof getUserFormSchema>>;
