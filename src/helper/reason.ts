export type ReasonT =
    | 'checkpoint_not_found'
    | 'request_not_found'
    | 'request_expired'
    | 'last_event_matches_the_incoming_one'
    | 'password_not_valid_or_user_not_found'
    | 'empty_id'
    | 'pass_not_found'
    | 'overlapping_pass_exists'
    | 'invalid_valid_from_field'
    | 'vehicle_not_found'
    | 'internal_server_error'
    | 'forbidden';

export const MAP_REASON_TO_MESSAGE: Record<ReasonT, string> = {
    checkpoint_not_found: 'Пропускной пункт не найден',
    request_not_found: 'Запрос не найден',
    request_expired: 'Срок действия запроса истёк',
    last_event_matches_the_incoming_one: 'Последнее событие совпадает с текущим',
    password_not_valid_or_user_not_found: 'Неверный пароль или пользователь не найден',
    empty_id: 'Пустой идентификатор',
    pass_not_found: 'Пропуск не найден',
    overlapping_pass_exists: 'Пропуск пересекается с существующим',
    invalid_valid_from_field: 'Неверная дата начала действия',
    vehicle_not_found: 'Транспортное средство не найдено',
    internal_server_error: 'Внутренняя ошибка сервера',
    forbidden: 'Не хватает прав доступа',
};
