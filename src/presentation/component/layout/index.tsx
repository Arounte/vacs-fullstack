import { useModalStore } from '@/data/modal';
import { useAdminSessionStore } from '@/data/session/store';
import { ACCESS, HOME, LOGOUT, LOGS, PASSES, SETTINGS, USERS, VEHICLES } from '@/framework/routes';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import type { MenuItem } from 'primereact/menuitem';
import { type PropsWithChildren, useCallback, useRef } from 'react';
import { ModalRoot } from './modal';

type PropsT = {
    isAuthorized: boolean;
};

const ITEMS = (push: (url: string) => Promise<boolean>): MenuItem[] => [
    {
        label: 'Главная',
        icon: 'pi pi-table',
        command: () => push(HOME),
    },
    {
        label: 'Контроль доступа',
        icon: 'pi pi-lock-open',
        command: () => push(ACCESS),
    },
    {
        label: 'Транспортные средства',
        icon: 'pi pi-car',
        command: () => push(VEHICLES),
    },
    {
        label: 'Пропуска',
        icon: 'pi pi-ticket',
        command: () => push(PASSES),
    },
    {
        label: 'Журнал событий',
        icon: 'pi pi-list-check',
        command: () => push(LOGS),
    },
    {
        label: 'Пользователи',
        icon: 'pi pi-user',
        command: () => push(USERS),
    },
    {
        label: 'Настройки',
        icon: 'pi pi-wrench',
        command: () => push(SETTINGS),
    },
];

const USER_MENU_ITEMS = (logout: () => void, open: () => void): MenuItem[] => [
    {
        label: 'Активные сессии',
        icon: 'pi pi-key',
        command: open,
    },
    {
        label: 'Выйти',
        icon: 'pi pi-sign-out',
        command: logout,
    },
];

export function Layout(props: PropsWithChildren<PropsT>) {
    const { isAuthorized, children } = props;
    const menu = useRef<Menu>(null);
    const { username: name, id, sid } = useAdminSessionStore();
    const { push } = useRouter();
    const { open } = useModalStore();

    const logout = useCallback(() => {
        push(LOGOUT).then();
    }, [push]);

    const renderEnd = useCallback(
        () => (
            <>
                <Button
                    label={name}
                    severity="secondary"
                    text
                    onClick={(e) => menu.current?.toggle(e)}
                    icon="pi pi-user"
                />
                <Menu
                    ref={menu}
                    popup
                    id="user_popup"
                    model={USER_MENU_ITEMS(logout, () => open('session', { id, sid }))}
                />
            </>
        ),
        [name, logout, open, id, sid],
    );

    return (
        <>
            {isAuthorized && <Menubar model={ITEMS(push)} end={renderEnd} />}
            <div className="flex-1 px-7 py-4">{children}</div>
            <ModalRoot />
        </>
    );
}
