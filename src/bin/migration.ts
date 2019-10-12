import { runMigrations } from "../server/db";
import logger from "../server/logger";
import { Client } from "pg";
import * as config from "config";

async function main() {
  const connectionString = config.get<string>("db_url");
  const client = new Client({ connectionString });
  await client.connect();
  await runMigrations(client);
}

main()
  .then(() => {
    logger.info("Finished running migrations");
    process.exit(0);
  })
  .catch(err => {
    logger.error("Error running migrations", err);
    process.exit(1);
  });
