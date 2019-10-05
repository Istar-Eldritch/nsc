import { Context } from "koa";
import { compare } from "../../utils/bcrypt-task";
import * as t from "io-ts";
import {
  map as mapRightEither,
  mapLeft as mapLeftEither,
  left
} from "fp-ts/lib/Either";
import {
  map as mapRightTask,
  mapLeft as mapLeftTask,
  flatten as flatTask,
  leftTask,
  rightTask,
  fromEither
} from "fp-ts/lib/TaskEither";
import { map as mapOption, getOrElse } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

import {
  getConnection,
  createSession,
  getUserByEmail,
  PublicUser,
  User,
  Session,
  toPublic
} from "../../db";
import { NonEmptyString, Email } from "../validations";
import logger from "../../logger";

const SignInCommandIO = t.interface({
  email: Email,
  password: NonEmptyString
});

type SignInCommand = t.TypeOf<typeof SignInCommandIO>;

export interface SignInSuccess {
  result: {
    user: PublicUser;
    token: string;
  };
}

interface UnexpectedError {
  status: 500;
  error_code: "UNEXPECTED_ERROR";
}

interface Unauthorized {
  status: 401;
  error_code: "UNAUTHORIZED";
}

interface InvalidPayloadError {
  status: 400;
  error_code: "INVALID_PAYLOAD";
  detail: { [k: string]: string };
}

interface Response {
  status: number;
  body: string;
}

function prettyfyErrors(errors: any) {
  return errors.reduce(
    (acc: any, err: any) => {
      // TODO Abstract error parser
      acc[err.context[1].key] =
        err.message || "Undefined problem with the payload";
      return acc;
    },
    {} as { [k: string]: string }
  );
}

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
