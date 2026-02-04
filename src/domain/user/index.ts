import {
    getEmailValidationSchema,
    getNewPasswordValidationSchema,
    getRoleValidationSchema,
    getStringValidationSchema,
    getUsernameValidationSchema,
} from '@/helper/validation/rules';
import * as v from 'valibot';
import { Role } from '../session';

export const AUTHORIZED_ROLES = [Role.Admin, Role.Operator] as const;

export const CreateUserSchema = v.object({
    username: getUsernameValidationSchema(),
    email: getEmailValidationSchema(),
    password: getNewPasswordValidationSchema(),
    role: v.pipe(v.picklist(AUTHORIZED_ROLES, 'Invalid role')),
});

export type CreateUserData = v.InferOutput<typeof CreateUserSchema>;

export const UpdateUserSchema = v.object({
    id: getStringValidationSchema(),
    username: v.optional(getUsernameValidationSchema()),
    email: v.optional(getEmailValidationSchema()),
    password: v.optional(v.union([v.literal(''), getNewPasswordValidationSchema()])),
    role: v.optional(getRoleValidationSchema()),
    isActive: v.optional(v.boolean()),
    lastLoginAt: v.optional(v.date()),
});

export type UpdateUserData = v.InferOutput<typeof UpdateUserSchema>;
