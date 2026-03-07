// prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Using process.env instead of the strict env() utility
    url: process.env.DATABASE_URL || "postgres://localhost:5432/dummy",
  },
});