import { useModalStore } from '@/data/modal';
import { useAdminSessionStore } from '@/data/session/store';
import { Role } from '@/domain/session';
import { CHECKPOINTS, EVENTS, HOME, LOGOUT, PASSES, USERS, VEHICLES } from '@/framework/routes';
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

const ITEMS = (role: Role, push: (url: string) => Promise<boolean>): MenuItem[] => [
    {
        label: 'Контроль доступа',
        icon: 'pi pi-lock-open',
        command: () => push(HOME),
    },
    {
        label: 'Транспортные средства',
        icon: 'pi pi-car',
        command: () => push(VEHICLES),
    },
    {
        label: 'КПП',
        icon: 'pi pi-flag',
        command: () => push(CHECKPOINTS),
    },
    {
        label: 'Пропуска',
        icon: 'pi pi-ticket',
        command: () => push(PASSES),
    },
    {
        label: 'Журнал событий',
        icon: 'pi pi-list-check',
        command: () => push(EVENTS),
    },
    ...(role === Role.Admin
        ? [
              {
                  label: 'Пользователи',
                  icon: 'pi pi-user',
                  command: () => push(USERS),
              },
          ]
        : []),
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
    const { username: name, id, sid, role } = useAdminSessionStore();
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
            {isAuthorized && <Menubar model={ITEMS(role, push)} end={renderEnd} />}
            <div className="px-7 py-4 flex-1 min-h-0">{children}</div>
            <ModalRoot />
        </>
    );
}
