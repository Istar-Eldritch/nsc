import { Client } from "pg";
import { Migration } from ".";

async function up(client: Client): Promise<void> {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await client.query(`create table users(
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );`);

  await client.query(`create table sessions(
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );`);
}

async function down(client: Client): Promise<void> {
  await client.query("drop table sessions;");
  await client.query("drop table users;");
  await client.query(`drop extension if exists "uuid-ossp";`);
}

const name = "2019-09-26T08:58:50.556Z-users_and_sessions_table";

const migration: Migration = {
  name,
  up,
  down
};

export default migration;
