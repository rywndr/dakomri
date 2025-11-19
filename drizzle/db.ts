// if using local postgres instance
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);

// refer to: https://orm.drizzle.team/docs/get-started/neon-new
