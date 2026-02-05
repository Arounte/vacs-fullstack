import type { Checkpoint } from '@/framework/db/schema';
import dayjs from 'dayjs';
import type { ColumnProps } from 'primereact/column';

export const COLUMNS: ColumnProps[] = [
    {
        field: 'name',
        header: 'Наименование',
    },
    {
        field: 'createdAt',
        header: 'Дата создания',
        body: ({ createdAt }: Checkpoint) => dayjs(createdAt).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
        field: 'updatedAt',
        header: 'Дата изменения',
        body: ({ updatedAt }: Checkpoint) => dayjs(updatedAt).format('DD.MM.YYYY HH:mm:ss'),
    },
];
