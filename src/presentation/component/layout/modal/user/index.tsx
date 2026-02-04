import { useModalStore } from '@/data/modal';
import { useUserStore } from '@/data/user/store';
import { Role } from '@/domain/session';
import type { AdminUser } from '@/framework/db/schema';
import { Input } from '@/presentation/component/form/input';
import { Select } from '@/presentation/component/form/select';
import { Switch } from '@/presentation/component/form/switch';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Modal } from '../common';
import { getUserFormSchema, type UserFormData } from './types';

export default function UserModal() {
    const { requestClose, getProps } = useModalStore();
    const { setUsers } = useUserStore();
    const { id } = getProps('user') ?? {};
    const [initializing, setInitializing] = useState(true);
    const isCreate = !id;
    const schema = getUserFormSchema(isCreate);
    const { control, handleSubmit, reset, watch } = useForm<UserFormData>({
        defaultValues: {
            username: '',
            email: '',
            role: Role.Operator,
            password: '',
            isActive: true,
        },
        resolver: valibotResolver(schema),
    });
    const { isValid } = useFormState({ control });
    const { get, post, patch, isPending } = useAPI();
    const { showError } = useToast();
    const username = watch('username');

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    useEffect(() => {
        if (!id) return setInitializing(false);

        async function execute() {
            const { status, data, reason } = await get<AdminUser>(`/users/${id}`);
            if (!status && reason) {
                return showError(reason);
            }

            reset({
                username: data?.username,
                email: data?.email,
                role: data?.role as Role.Admin | Role.Operator | undefined,
                isActive: data?.isActive,
            });
        }

        execute().then(() => setInitializing(false));

        return () => {
            setInitializing(true);
        };
    }, [id]);

    const fetchUsers = async () => {
        const { status, data, reason } = await get<AdminUser[]>('/users');
        if (!status && reason) {
            return showError(reason);
        }

        if (data) {
            setUsers(data);
        }
    };

    const onSubmit = async (data: UserFormData) => {
        // if (isCreate) {
        const { status, reason } = isCreate
            ? await post(`/users`, data)
            : await patch(`/users/${id}`, data);
        if (status) {
            fetchUsers();

            return requestClose();
        }

        if (reason) showError(reason);
    };

    return (
        <Modal
            className="w-1/2"
            name="user"
            header={id ? `Редактирование пользователя ${username}` : 'Создание пользователя'}
        >
            <form className="p-6 flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Имя пользователя"
                    name="username"
                    control={control}
                    initializing={initializing}
                    autoComplete="off"
                />
                <Input
                    type="email"
                    name="email"
                    control={control}
                    initializing={initializing}
                    label="E-mail"
                    autoComplete="off"
                />
                <Input
                    type="password"
                    name="password"
                    control={control}
                    initializing={initializing}
                    label="Новый пароль"
                    autoComplete="new-password"
                />
                <Select
                    name="role"
                    control={control}
                    label="Роль"
                    initializing={initializing}
                    options={[
                        {
                            value: Role.Admin,
                            label: 'Администратор',
                        },
                        {
                            value: Role.Operator,
                            label: 'Оператор',
                        },
                    ]}
                />
                {!isCreate && (
                    <Switch
                        label="Активен"
                        name="isActive"
                        control={control}
                        disabled={initializing}
                    />
                )}
                <Button
                    loading={isPending}
                    type="submit"
                    label="Сохранить"
                    disabled={!isValid || initializing}
                />
            </form>
        </Modal>
    );
}
