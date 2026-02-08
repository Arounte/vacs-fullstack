import type { SessionOptions } from 'iron-session';

export const SESSION_OPTIONS: SessionOptions = {
    // biome-ignore lint/style/noNonNullAssertion: .
    password: process.env.ADMIN_SECRET!,
    cookieName: '_admin_sid',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export interface Session {
    sid: string;
    id: string;
    username: string;
    role: Role;
    checkpointId: string | null;
}

export interface CreateSessionData {
    userId: string;
    ipAddress: string;
    userAgent: string;
}

export interface UpdateSessionData {
    id: string;
    ipAddress?: string;
    userAgent?: string;
    lastActivityAt?: Date;
}

export enum Role {
    Admin = 'admin',
    Operator = 'operator',
    Guest = 'guest',
}

export const MAP_ROLE_TO_TITLE: Record<Role, string> = {
    [Role.Admin]: 'Администратор',
    [Role.Operator]: 'Оператор',
    [Role.Guest]: 'Гость',
};
