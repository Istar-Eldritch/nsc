import { Client, PoolClient, Pool } from "pg";
import { v4 } from "uuid";
import { Option, fromNullable } from "fp-ts/lib/Option";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";

import { QueryResultError } from "..";

export interface Session {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function createSession(
  pg: Client | PoolClient | Pool,
  user_id: string
): TaskEither<QueryResultError, Session> {
  const id = v4();
  const date = new Date().toISOString();
  return tryCatch(
    () =>
      pg
        .query<Session>(
          `insert into sessions(id, user_id, created_at, updated_at) values($1, $2, $3, $4) returning *`,
          [id, user_id, date, date]
        )
        .then(result => result.rows[0]),
    reason => reason as QueryResultError
  );
}

export function getSessionById(
  pg: Client | PoolClient | Pool,
  id: string
): TaskEither<QueryResultError, Option<Session>> {
  return tryCatch(
    () =>
      pg
        .query<Session>(`select * from sessions where id = $1`, [id])
        .then(result => fromNullable(result.rows[0])),
    reason => reason as QueryResultError
  );
}

export function getSessionsByUserId(
  pg: Client | PoolClient | Pool,
  user_id: string
): TaskEither<QueryResultError, Session[]> {
  return tryCatch(
    () =>
      pg
        .query<Session>(`select * from sessions where user_id = $1`, [user_id])
        .then(result => result.rows),
    reason => reason as QueryResultError
  );
}
