import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    inet,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

// Таблица admin_user
export const adminUser = pgTable(
    "admin_user",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        username: varchar("username", { length: 50 }).notNull().unique(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        password: text("password").notNull(), // Хэшированный пароль
        role: varchar("role", { length: 20 }).notNull().default("admin"), // admin, superadmin, moderator
        isActive: boolean("is_active").notNull().default(true),
        lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        {
            usernameIdx: index("username_idx").on(table.username),
            emailIdx: index("email_idx").on(table.email),
        },
    ],
);

// Таблица admin_sessions
export const adminSession = pgTable(
    "admin_sessions",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => adminUser.id, { onDelete: "cascade" }),
        ipAddress: inet("ip_address").notNull(),
        userAgent: text("user_agent"), // Браузер и устройство
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        {
            userIdIdx: index("user_id_idx").on(table.userId),
            expiresAtIdx: index("expires_at_idx").on(table.expiresAt),
        },
    ],
);

// Связи между таблицами
export const adminUserRelations = relations(adminUser, ({ many }) => ({
    sessions: many(adminSession),
}));

export const adminSessionRelations = relations(adminSession, ({ one }) => ({
    user: one(adminUser, {
        fields: [adminSession.userId],
        references: [adminUser.id],
    }),
}));

// Типы для TypeScript
export type AdminUser = typeof adminUser.$inferSelect;
export type NewAdminUser = typeof adminUser.$inferInsert;
export type AdminSession = typeof adminSession.$inferSelect;
export type NewAdminSession = typeof adminSession.$inferInsert;
