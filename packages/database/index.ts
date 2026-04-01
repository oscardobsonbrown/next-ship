import "server-only";

import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { keys } from "./keys";
import * as schema from "./src/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: keys().DATABASE_URL });

export const database = drizzle(pool, { schema });

// Re-export drizzle-orm helpers
export { eq, ilike } from "drizzle-orm";
export * from "./src/schema";
