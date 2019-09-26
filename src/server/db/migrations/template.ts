import { Client } from "pg";
import { Migration } from ".";

async function up(_client: Client): Promise<void> {
  /* TODO Implement */
}

async function down(_client: Client): Promise<void> {
  /* TODO Implement */
}

const name = "2019-09-26T08:58:50.556Z-template";

const migration: Migration = {
  name,
  up,
  down
};

export default migration;
