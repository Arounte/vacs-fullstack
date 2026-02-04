import { Role } from '@/domain/session';
import * as v from 'valibot';

export function getStringValidationSchema() {
    return v.pipe(v.string(), v.trim(), v.minLength(1, 'Обязательно для заполнения'));
}

export function getNewPasswordValidationSchema() {
    return v.pipe(
        v.string('Пароль должен быть строкой'),
        v.minLength(8, 'Минимальная длина пароля - 8 символов'),
        v.regex(/[A-Z]/, 'Пароль должен содержать минимум одну заглавную букву'),
        v.regex(/[a-z]/, 'Пароль должен содержать минимум одну строчную букву'),
        v.regex(/[0-9]/, 'Пароль должен содержать минимум одну цифру'),
    );
}

export function getUsernameValidationSchema() {
    return v.pipe(
        v.string('Имя пользователя должно быть строкой'),
        v.minLength(3, 'Минимальная длина - 3 символа'),
        v.maxLength(30, 'Максимальная длина - 30 символов'),
        v.regex(
            /^[a-zA-Z0-9_-]+$/,
            'Имя пользователя может содержать только буквы, цифры, подчеркивания и дефисы',
        ),
    );
}

export function getEmailValidationSchema() {
    return v.pipe(v.string('Email должен быть строкой'), v.email('Неверный формат'));
}

export function getRoleValidationSchema() {
    const AUTHORIZED_ROLES = [Role.Admin, Role.Operator] as const;

    return v.pipe(v.picklist(AUTHORIZED_ROLES, 'Неверная роль'));
}
