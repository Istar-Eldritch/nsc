import { Pool } from "pg";
import { Option, Some, None } from "funfix";

import logger from "../logger";

// import { runMigrations } from "./migrations";

export * from "./migrations";
export * from "./daos";

let connection: Option<Pool> = None;

async function getEnv(key: string): Promise<string> {
  return Option.of(process.env[key]).getOrElseL(() =>
    Promise.reject(new Error(`Must provide env ${key}`))
  );
}

export async function getConnection(): Promise<Pool> {
  if (connection.isEmpty()) {
    logger.info("Creating a new pool of database clients");
    const connectionString = await getEnv("DATABASE_URL");
    const pool = new Pool({ connectionString });
    pool.on("error", e => {
      logger.error("Error on database connection", e);
      // TODO Connection retry instead of exit
      process.exit(1);
    });
    connection = Some(pool);
    return pool;
  } else {
    return connection.get();
  }
}
