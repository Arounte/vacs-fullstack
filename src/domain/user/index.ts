import type { Role } from '../session';

export type AuthorizedRole = Omit<Role, Role.Guest>;

export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    role: AuthorizedRole;
}

export interface UpdateUserData {
    id: string;
    username?: string;
    email?: string;
    password?: string;
    role?: AuthorizedRole;
    isActive?: boolean;
    lastLoginAt?: Date;
}
