import { MAP_ROLE_TO_TITLE, type Role } from '@/domain/session';
import type { AdminUser } from '@/framework/db/schema';
import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Column, type ColumnProps } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputSwitch } from 'primereact/inputswitch';
import type { FC } from 'react';

type PropsT = {
    users: AdminUser[];
};

const COLUMNS: ColumnProps[] = [
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
        body: ({ isActive }: AdminUser) => <InputSwitch checked={isActive} />,
    },
    {
        field: 'lastLoginAt',
        header: 'Последняя авторизация',
        body: ({ lastLoginAt }: AdminUser) => dayjs(lastLoginAt).format('DD.MM.YYYY HH:mm:ss'),
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

export const Users: FC<PropsT> = (props) => {
    const { users } = props;

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Список пользователей</h1>
                <Button label="Создать" icon="pi pi-plus" />
            </div>
            <DataTable value={users}>
                {COLUMNS.map((col) => (
                    <Column key={col.field} {...col} />
                ))}
            </DataTable>
        </div>
    );
};
