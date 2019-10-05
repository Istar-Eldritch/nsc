import { Client, PoolClient, Pool } from "pg";
import { v4 } from "uuid";
import { hash } from "bcryptjs";
import { Option, fromNullable } from "fp-ts/lib/Option";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { QueryResultError } from "..";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function toPublic(user: User): PublicUser {
  const publicUser = { ...user };
  delete publicUser.password_hash;
  return publicUser;
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
  const result = await pg.query<User>(
    `
    insert into users(id, name, email, password_hash, created_at, updated_at) values ($1, $2, $3, $4, $5, $6) returning *
  `,
    [id, name, email, password_hash, date, date]
  );

  return result.rows[0];
}

export function getUserByEmail(
  pg: Client | PoolClient | Pool,
  email: string
): TaskEither<QueryResultError, Option<User>> {
  return tryCatch(
    () =>
      pg
        .query<User>(`select * from users where email = $1`, [email])
        .then(result => fromNullable(result.rows[0])),
    reason => reason as QueryResultError
  );
}
