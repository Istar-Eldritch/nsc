import { Pool, Client } from "pg";
import logger from "../../logger";
import { Option } from "funfix";

import users_and_session_table from "./2019-09-26T08:58:50.556Z-users_and_sessions_table";

export interface Migration {
  name: string; // Format ISO 8601 Notation - Custom String (2019-09-26T08:58:50.556Z-create-table)
  up(client: Pool | Client): Promise<void>;
  down(client: Pool | Client): Promise<void>;
}

interface MigrationRow {
  id: number;
  name: string; // Format ISO 8601 Notation - Custom String (2019-09-26T08:58:50.556Z-create-table)
  created_at: string; // ISO String 8601, when the migration was run
}

const migrations: Migration[] = [users_and_session_table];

export async function runMigrations(client: Pool | Client): Promise<void> {
  try {
    await client.query("BEGIN");

    await client.query(`create table if not exists migrations(
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    );`);

    const lastMigrationRows = await client.query(
      "select * from migrations order by created_at desc limit 1"
    );
    const lastMigration: Option<MigrationRow> = Option.of(
      lastMigrationRows.rows.pop()
    );

    const filterNewMigrations = (migration: Migration) =>
      lastMigration.map(last => last.name < migration.name).getOrElse(true);

    const newMigrations = migrations.filter(filterNewMigrations);

    for (const migration of newMigrations) {
      logger.info(`Running ${migration.name}`);
      await migration.up(client);
      await client.query(
        `insert into migrations(name, created_at) values($1, $2)`,
        [migration.name, new Date().toISOString()]
      );
    }

    if (newMigrations.length === 0) {
      logger.info("No migrations to run");
    } else {
      logger.info(`Finished running ${migrations.length} migrations`);
    }

    await client.query("COMMIT");
  } catch (err) {
    logger.error("Error in transaction", err);
    client.query("ROLLBACK").catch(err => {
      logger.error("Error rolling back transaction", err.stack);
    });
  }
}
