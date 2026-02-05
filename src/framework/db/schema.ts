import { relations } from 'drizzle-orm';
import {
    boolean,
    index,
    inet,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';


export const eventTypeEnum = pgEnum('event_type', ['in', 'out']);
export const resultTypeEnum = pgEnum('result_type', ['allowed', 'denied']);

export const adminUser = pgTable(
    'admin_user',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        username: varchar('username', { length: 50 }).notNull().unique(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        password: text('password').notNull(), // Хэшированный пароль
        role: varchar('role', { length: 20 }).notNull().default('admin'), // admin, superadmin, moderator
        isActive: boolean('is_active').notNull().default(true),
        lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        {
            usernameIdx: index('username_idx').on(table.username),
            emailIdx: index('email_idx').on(table.email),
        },
    ],
);

export const adminSession = pgTable(
    'admin_sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => adminUser.id, { onDelete: 'cascade' }),
        ipAddress: inet('ip_address').notNull(),
        userAgent: text('user_agent'), // Браузер и устройство
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
        lastActivityAt: timestamp('last_activity_at', { withTimezone: true })
            .notNull()
            .defaultNow(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        {
            userIdIdx: index('user_id_idx').on(table.userId),
            expiresAtIdx: index('expires_at_idx').on(table.expiresAt),
        },
    ],
);

export const vehicles = pgTable('vehicles', {
    id: uuid('id').defaultRandom().primaryKey(),
    plateNumber: varchar('plate_number', { length: 10 }).notNull().unique(),
    ownerName: text('owner_name').notNull(),
    ownerPhone: text('owner_phone').notNull(),
    model: text('model'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const checkpoints = pgTable('checkpoints', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const passes = pgTable(
    'passes',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        vehicleId: uuid('vehicle_id')
            .notNull()
            .references(() => vehicles.id, { onDelete: 'restrict' }),
        checkpointId: uuid('checkpoint_id')
            .notNull()
            .references(() => checkpoints.id, { onDelete: 'restrict' }),
        isActive: boolean('is_active').notNull().default(true),
        validFrom: timestamp('valid_from', { withTimezone: true }).notNull().defaultNow(),
        validTo: timestamp('valid_to', { withTimezone: true }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        {
            passesVehicleIdx: index('passes_vehicle_idx').on(table.vehicleId),
            passesCheckpointIdx: index('passes_checkpoint_idx').on(table.checkpointId),
            passesIsActiveIdx: index('passes_is_active_idx').on(table.isActive),
            passesValidToIdx: index('passes_valid_to_idx').on(table.validTo),
        },
    ],
);

export const accessEvents = pgTable(
    'access_events',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id').references(() => adminUser.id, { onDelete: 'set null' }),
        username: text('username').notNull(),
        passId: uuid('pass_id').references(() => passes.id, { onDelete: 'set null' }),
        vehicleId: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
        checkpointId: uuid('checkpoint_id').references(() => checkpoints.id, {
            onDelete: 'set null',
        }),
        plateNumber: varchar('plate_number', { length: 10 }).notNull(),
        vehicleModel: text('vehicle_model'),
        checkpointName: text('checkpoint_name').notNull(),
        eventType: eventTypeEnum('event_type').notNull(),
        timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
        result: resultTypeEnum('result').notNull(),
        reason: text('reason'),
    },
    (table) => [
        {
            accessEventsVehicleIdx: index('access_events_vehicle_idx').on(table.vehicleId),
            accessEventsCheckpointIdx: index('access_events_checkpoint_idx').on(table.checkpointId),
            accessEventsUserIdx: index('access_events_user_idx').on(table.userId),
            accessEventsTimestampIdx: index('access_events_timestamp_idx').on(table.timestamp),
            accessEventsResultIdx: index('access_events_result_idx').on(table.result),
        },
    ],
);

// Связи между таблицами
export const adminUserRelations = relations(adminUser, ({ many }) => ({
    sessions: many(adminSession),
    accessEvents: many(accessEvents),
}));

export const adminSessionRelations = relations(adminSession, ({ one }) => ({
    user: one(adminUser, {
        fields: [adminSession.userId],
        references: [adminUser.id],
    }),
}));

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
    passes: many(passes),
    accessEvents: many(accessEvents),
}));

export const checkpointsRelations = relations(checkpoints, ({ many }) => ({
    passes: many(passes),
    accessEvents: many(accessEvents),
}));

export const passesRelations = relations(passes, ({ one, many }) => ({
    vehicle: one(vehicles, {
        fields: [passes.vehicleId],
        references: [vehicles.id],
    }),
    checkpoint: one(checkpoints, {
        fields: [passes.checkpointId],
        references: [checkpoints.id],
    }),
    accessEvents: many(accessEvents),
}));

export const accessEventsRelations = relations(accessEvents, ({ one }) => ({
    user: one(adminUser, {
        fields: [accessEvents.userId],
        references: [adminUser.id],
    }),
    pass: one(passes, {
        fields: [accessEvents.passId],
        references: [passes.id],
    }),
    vehicle: one(vehicles, {
        fields: [accessEvents.vehicleId],
        references: [vehicles.id],
    }),
    checkpoint: one(checkpoints, {
        fields: [accessEvents.checkpointId],
        references: [checkpoints.id],
    }),
}));

// Типы для TypeScript
export type AdminUser = typeof adminUser.$inferSelect;
export type AdminSession = typeof adminSession.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type Checkpoint = typeof checkpoints.$inferSelect;
export type Pass = typeof passes.$inferSelect;
export type PassCreate = typeof passes.$inferInsert;
export type AccessEvent = typeof accessEvents.$inferSelect;
