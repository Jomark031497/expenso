import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/**/*.schema.ts",
  out: "./drizzle",
  verbose: true,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: <string>process.env.DATABASE_URL,
  },
});
