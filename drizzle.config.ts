import { defineConfig } from "drizzle-kit";
import './env.config.ts';

export default defineConfig({
    out: "./drizzle",
    schema: "./src/framework/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        // biome-ignore lint/style/noNonNullAssertion: .
        url: process.env.DATABASE_URL!,
    },
});
