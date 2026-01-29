import { useModalStore } from '@/data/modal';
import type { AdminSession } from '@/framework/db/schema';
import { useAPI } from '@/presentation/hooks/useAPI';
import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { Column, type ColumnProps } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from '../common';

const COLUMNS: ColumnProps[] = [
    { field: 'ipAddress', header: 'IP-адрес' },
    { field: 'userAgent', header: 'User-Agent', bodyStyle: { width: '5rem' } },
    {
        field: 'lastActivityAt',
        header: 'Последняя активность',
        body: ({ lastActivityAt }: AdminSession) =>
            dayjs(lastActivityAt).format('DD.MM.YYYY HH:mm'),
    },
    {
        field: 'createdAt',
        header: 'Дата входа',
        body: ({ createdAt }: AdminSession) => dayjs(createdAt).format('DD.MM.YYYY HH:mm'),
    },
];

export default function SessionModal() {
    const { requestClose, getProps } = useModalStore();
    const { get, isPending, del } = useAPI();
    const [result, setResult] = useState<AdminSession[]>([]);
    const { id, sid } = getProps('session') ?? {};

    const request = useCallback(async () => {
        const { status, data } = await get<AdminSession[]>(`/sessions/${id}`);
        if (!status || !data) {
            requestClose();
            return;
        }

        const sorted = data.sort((a, b) => {
            if (a.id === sid) return -1;
            if (b.id === sid) return 1;
            return 0;
        });

        setResult(sorted);
    }, [get, id, requestClose, sid]);

    useEffect(() => {
        if (!id || !sid) return;

        request();
    }, [id, request, sid]);

    useEffect(() => {
        return () => {
            setResult([]);
        };
    }, []);

    const onDelete = async (target: string) => {
        const { status } = await del(`/session/${target}`);
        if (status) {
            await request();
        }
    };

    return (
        <Modal name="session" header="Активные сессии">
            {isPending && <ProgressSpinner />}
            {!!result.length && (
                <DataTable value={result} tableStyle={{ minWidth: '50rem' }}>
                    {COLUMNS.map((col) => (
                        <Column key={col.field} {...col} />
                    ))}
                    <Column
                        field="id"
                        header="Действие"
                        body={({ id }) =>
                            id === sid ? (
                                'Текущая'
                            ) : (
                                <Button
                                    severity="secondary"
                                    text
                                    icon="pi pi-times"
                                    onClick={() => onDelete(id)}
                                />
                            )
                        }
                    />
                </DataTable>
            )}
        </Modal>
    );
}
