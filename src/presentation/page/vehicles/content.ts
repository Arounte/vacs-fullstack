import type { Vehicle } from '@/framework/db/schema';
import dayjs from 'dayjs';
import type { ColumnProps } from 'primereact/column';

export const COLUMNS: ColumnProps[] = [
    {
        field: 'plateNumber',
        header: 'Номер ТС',
    },
    {
        field: 'ownerName',
        header: 'Имя владельца',
    },
    {
        field: 'ownerPhone',
        header: 'Телефон владельца',
    },
    {
        field: 'model',
        header: 'Марка/модель ТС',
    },
    {
        field: 'createdAt',
        header: 'Дата создания',
        body: ({ createdAt }: Vehicle) => dayjs(createdAt).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
        field: 'updatedAt',
        header: 'Дата изменения',
        body: ({ updatedAt }: Vehicle) => dayjs(updatedAt).format('DD.MM.YYYY HH:mm:ss'),
    },
];
