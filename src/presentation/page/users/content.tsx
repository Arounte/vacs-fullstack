import { MAP_ROLE_TO_TITLE, type Role } from '@/domain/session';
import type { AdminUser } from '@/framework/db/schema';
import dayjs from 'dayjs';
import type { ColumnProps } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';

export const COLUMNS = (
    setIsActive: (id: string, state: boolean) => Promise<void>,
): ColumnProps[] => [
    {
        field: 'username',
        header: 'Имя пользователя',
    },
    {
        field: 'email',
        header: 'E-mail',
    },
    {
        field: 'role',
        header: 'Роль',
        body: ({ role }: AdminUser) => MAP_ROLE_TO_TITLE[role as Role],
    },
    {
        field: 'isActive',
        header: 'Статус',
        body: ({ id, isActive }: AdminUser) => (
            <InputSwitch checked={isActive} onChange={(e) => setIsActive(id, e.value)} />
        ),
    },
    {
        field: 'lastLoginAt',
        header: 'Последняя авторизация',
        body: ({ lastLoginAt }: AdminUser) =>
            lastLoginAt ? dayjs(lastLoginAt).format('DD.MM.YYYY HH:mm:ss') : '–',
    },
    {
        field: 'createdAt',
        header: 'Дата создания',
        body: ({ createdAt }: AdminUser) => dayjs(createdAt).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
        field: 'updatedAt',
        header: 'Дата изменения',
        body: ({ updatedAt }: AdminUser) => dayjs(updatedAt).format('DD.MM.YYYY HH:mm:ss'),
    },
];
