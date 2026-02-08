import { useModalStore } from '@/data/modal';
import { useUserStore } from '@/data/user/store';
import type { AdminUser } from '@/framework/db/schema';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCallback } from 'react';
import { COLUMNS } from './content';

export const Users = () => {
    const { users, setUsers } = useUserStore();
    const { open } = useModalStore();
    const { get, patch } = useAPI();
    const { showError } = useToast();

    const fetchUsers = useCallback(async () => {
        const { data } = await get<AdminUser[]>('/users');
        if (data) {
            setUsers(data);
        }
    }, [get, setUsers]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    const setIsActive = useCallback(
        async (id: string, state: boolean) => {
            const { status, reason } = await patch(`/users/${id}`, {
                isActive: state,
            });
            if (!status && reason) {
                return showError(reason);
            }

            fetchUsers();
        },
        [patch, fetchUsers],
    );

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Список пользователей</h1>
                <Button label="Создать" icon="pi pi-plus" onClick={() => open('user', {})} />
            </div>
            <div className="flex-1 min-h-0 rounded-md border border-gray-200 bg-white overflow-auto">
                <DataTable value={users}>
                    {COLUMNS(setIsActive).map((col) => (
                        <Column key={col.field} {...col} />
                    ))}
                    <Column
                        field="id"
                        header="Действие"
                        body={({ id }: AdminUser) => (
                            <Button
                                severity="secondary"
                                text
                                icon="pi pi-pencil"
                                onClick={() => open('user', { id })}
                            />
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};
