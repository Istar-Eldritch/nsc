import { TaskEither } from "fp-ts/lib/TaskEither";
import { Either } from "fp-ts/lib/Either";

declare module "io-ts/lib/TaskEither" {
  function fromEither<E, A>(ma: Either<E, A>): TaskEither<E, A>;
}
