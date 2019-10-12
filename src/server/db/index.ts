import { Pool } from "pg";
import { Option, Some, None } from "funfix";
import config from "config";

import logger from "../logger";

// import { runMigrations } from "./migrations";

export * from "./migrations";
export * from "./daos";

let connection: Option<Pool> = None;

export async function getConnection(): Promise<Pool> {
  if (connection.isEmpty()) {
    logger.info("Creating a new pool of database clients");
    const connectionString = config.get<string>("db_url");
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
