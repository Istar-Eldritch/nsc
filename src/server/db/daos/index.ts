export * from "./user";
export * from "./session";

export interface QueryResultError extends Error {
  code: number;
}
