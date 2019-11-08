import { Context } from "koa";
import { compare } from "../../../utils/bcrypt-task";
import {
  left,
  map as mapRightEither,
  mapLeft as mapLeftEither
} from "fp-ts/lib/Either";
import {
  flatten as flatTask,
  fromEither,
  leftTask,
  map as mapRightTask,
  mapLeft as mapLeftTask,
  rightTask
} from "fp-ts/lib/TaskEither";
import { getOrElse, map as mapOption } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

import {
  createSession,
  getConnection,
  getUserByEmail,
  Session,
  toPublic,
  User
} from "../../../db";
import logger from "../../../logger";
import {
  InvalidPayloadError,
  prettyfyErrors,
  Response,
  SignInCommand,
  SignInCommandIO,
  SignInSuccess,
  Unauthorized,
  UnexpectedError
} from "./interfaces";

function ok(body: any): Response {
  return {
    status: 200,
    body: JSON.stringify(body)
  };
}

function unexpectedError(): Response {
  return {
    status: 500,
    body: JSON.stringify({
      status: 500,
      error_code: "UNEXPECTED_ERROR"
    } as UnexpectedError)
  };
}

function unauthorizedError(): Response {
  return {
    status: 401,
    body: JSON.stringify({
      status: 401,
      error_code: "UNAUTHORIZED"
    } as Unauthorized)
  };
}

function errorsToResponse(errors: any): Response {
  return {
    status: 400,
    body: JSON.stringify({
      status: 400,
      error_code: "INVALID_PAYLOAD",
      detail: prettyfyErrors(errors)
    } as InvalidPayloadError)
  };
}

function injectResponse(ctx: Context) {
  return ({ status, body }: Response) => {
    ctx.status = status;
    ctx.body = body;
  };
}

export async function signin(ctx: Context) {
  try {
    const pg = await getConnection();
    const result = await pipe(
      SignInCommandIO.decode(ctx.request.body),
      mapLeftEither(errorsToResponse),
      mapRightEither(({ email, password }: SignInCommand) =>
        pipe(
          getUserByEmail(pg, email),
          mapLeftTask(() => unexpectedError()),
          mapRightTask(
            mapOption(user =>
              pipe(
                compare(password, user.password_hash),
                rightTask,
                mapRightTask(result => {
                  if (result) {
                    return mapLeftTask(() => unexpectedError())(
                      createSession(pg, user.id)
                    );
                  } else {
                    return leftTask(() => Promise.reject(unauthorizedError()));
                  }
                }),
                flatTask,
                mapRightTask(session => [user, session] as [User, Session])
              )
            )
          ),
          mapRightTask(option =>
            getOrElse(() =>
              leftTask<Response, [User, Session]>(() =>
                Promise.reject(unauthorizedError())
              )
            )(option)
          ),
          flatTask
        )
      ),
      fromEither,
      flatTask,
      mapRightTask(([user, session]) =>
        ok({
          result: {
            user: toPublic(user),
            token: session.id
          }
        } as SignInSuccess)
      )
    )().catch((err: Response) => left(err));

    mapRightEither(injectResponse(ctx))(result);
    mapLeftEither(injectResponse(ctx))(result);
  } catch (err) {
    logger.error("Unexpected error", err);
    injectResponse(ctx)(unexpectedError());
  }
}
