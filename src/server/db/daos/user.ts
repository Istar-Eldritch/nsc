import { Client, PoolClient, Pool } from "pg";
import { v4 } from "uuid";
import { hash } from "bcryptjs";

interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export async function createUser(
  pg: Client | PoolClient | Pool,
  name: string,
  email: string,
  password: string
): Promise<User> {
  const id = v4();
  const password_hash = await hash(password, 12);
  const date = new Date().toISOString();
  const result = await pg.query(
    `
    insert into users(id, name, email, password_hash, created_at, updated_at) values ($1, $2, $3, $4, $5, $6) returning *
  `,
    [id, name, email, password_hash, date, date]
  );

  return result.rows[0];
}
