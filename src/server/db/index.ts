import { Pool } from "pg";
import { Option, Some, None } from "funfix";

import logger from "../logger";

// import { runMigrations } from "./migrations";

export * from "./migrations";
export * from "./daos";

let connection: Option<Pool> = None;

export async function getConnection(): Promise<Pool> {
  if (connection.isEmpty()) {
    logger.info("Creating new connection to database");
    const db_url = Option.of(process.env.DATABASE_URL);

    return db_url
      .map(async connectionString => {
        const pool = new Pool({ connectionString });
        await pool.connect();
        pool.on("error", e => {
          logger.error("Error on database connection", e);
          // TODO Connection retry instead of exit
          process.exit(1);
        });
        connection = Some(pool);
        return pool;
      })
      .getOrElseL(() => Promise.reject(new Error("Must provide DATABASE_URL")));
  } else {
    return connection.get();
  }
}
