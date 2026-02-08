import {
    AUTH_FORM_DEFAULT_VALUES,
    AUTH_FORM_VALIDATION_SCHEMA,
    type AuthForm,
} from '@/domain/auth';
import { useAPI } from '@/presentation/hooks/useAPI';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { type FC, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../component/form/input';

export const AdminLogin: FC = () => {
    const { control, handleSubmit } = useForm<AuthForm>({
        defaultValues: AUTH_FORM_DEFAULT_VALUES,
        resolver: valibotResolver(AUTH_FORM_VALIDATION_SCHEMA),
    });
    const { post, isPending } = useAPI();
    const toast = useRef<Toast>(null);

    const submit = useCallback(
        async (data: AuthForm) => {
            const { status, reason } = await post('/auth', data);
            if (!status && reason) {
                return toast.current?.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: reason,
                });
            } else if (!status) return;

            window.location.href = '/';
        },
        [post],
    );

    return (
        <>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <Card className="w-1/3" title="Авторизация">
                    <form className="gap-10 mt-2 flex flex-col" onSubmit={handleSubmit(submit)}>
                        <Input name="username" control={control} label="Имя пользователя" />
                        <Input name="password" control={control} type="password" label="Пароль" />
                        <Button
                            type="submit"
                            className="self-end"
                            label="Войти"
                            loading={isPending}
                        />
                    </form>
                </Card>
            </div>
            <Toast ref={toast} />
        </>
    );
};
