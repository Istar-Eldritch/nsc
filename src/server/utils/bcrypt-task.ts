import { compare as bcompare, hash as bhash } from "bcryptjs";
import { Task } from "fp-ts/lib/Task";

export function hash(s: string, salt: string | number): Task<string> {
  return () => bhash(s, salt);
}

export function compare(s: string, hash: string): Task<boolean> {
  return () => bcompare(s, hash);
}
