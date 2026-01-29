ALTER TABLE "admin_sessions" DROP CONSTRAINT "admin_sessions_session_id_unique";--> statement-breakpoint
DROP INDEX "session_id_idx";--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
DROP INDEX "expires_at_idx";--> statement-breakpoint
DROP INDEX "username_idx";--> statement-breakpoint
DROP INDEX "email_idx";--> statement-breakpoint
ALTER TABLE "admin_sessions" DROP COLUMN "session_id";