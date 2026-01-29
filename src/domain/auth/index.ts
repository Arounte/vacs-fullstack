import { getStringValidationSchema } from '@/helper/validation/string';
import * as v from 'valibot';

export interface AuthForm {
    username: string;
    password: string;
}

export const AUTH_FORM_DEFAULT_VALUES: AuthForm = {
    username: '',
    password: '',
};

export const AUTH_FORM_VALIDATION_SCHEMA = v.object({
    username: getStringValidationSchema(),
    password: getStringValidationSchema(),
});
