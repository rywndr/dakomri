// if using local postgres instance
// import { drizzle } from "drizzle-orm/node-postgres";

// if using neon serverless
import { drizzle } from "drizzle-orm/neon-http";
// if using neon serverless and need a synchronous connection
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// export const db = drizzle(process.env.DATABASE_URL!);

// refer to: https://orm.drizzle.team/docs/get-started/neon-new
