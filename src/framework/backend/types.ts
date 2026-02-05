import type { Role } from '@/domain/session';
import type { NextApiRequest, NextApiResponse } from 'next';

// biome-ignore lint/suspicious/noExplicitAny: .
export type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;

export type RouteHandler = Handler | { handler: Handler; roles?: Role[] };

export type REST = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Routes = Partial<Record<REST, RouteHandler>>;
