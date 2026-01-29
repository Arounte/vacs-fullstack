import * as v from 'valibot';

export function getStringValidationSchema() {
    return v.pipe(v.string(), v.trim(), v.minLength(1, 'Обязательно для заполнения'));
}
