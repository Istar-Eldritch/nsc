import { Context } from "koa";
import * as t from "io-ts";
import { isRight } from "fp-ts/lib/Either";

import { getConnection, createUser, PublicUser, toPublic } from "../../db";
import logger from "../../logger";
import { NonEmptyString, Email } from "../validations";

const CreateUserCmdIO = t.interface({
  name: NonEmptyString,
  email: Email,
  password: NonEmptyString
});

type CreateUserCmd = t.TypeOf<typeof CreateUserCmdIO>;

interface CreateUserResponse {
  result: PublicUser;
}

interface AlreadyRegisteredError {
  error_code: "ALREADY_REGISTERED";
}

interface UnexpectedError {
  error_code: "UNEXPECTED_ERROR";
}

interface InvalidPayloadError {
  error_code: "INVALID_PAYLOAD";
  detail: { [k: string]: string };
}

export async function signup(ctx: Context) {
  try {
    const validation = CreateUserCmdIO.decode(ctx.request.body);
    if (isRight(validation)) {
      const connection = await getConnection();
      const { name, email, password } = ctx.request.body as CreateUserCmd;
      const user = await createUser(connection, name, email, password);

      const response: CreateUserResponse = {
        result: toPublic(user)
      };

      ctx.body = JSON.stringify(response);
      ctx.status = 201;
    } else {
      ctx.body = JSON.stringify({
        error_code: "INVALID_PAYLOAD",
        detail: validation.left.reduce(
          (acc, err) => {
            // TODO Abstract error parser
            acc[err.context[1].key] =
              err.message || "Undefined problem with the payload";
            return acc;
          },
          {} as { [k: string]: string }
        )
      } as InvalidPayloadError);
      ctx.status = 400;
    }
  } catch (err) {
    if (
      err.message &&
      err.message.includes(
        `duplicate key value violates unique constraint "users_email_key"`
      )
    ) {
      ctx.body = JSON.stringify({
        error_code: "ALREADY_REGISTERED"
      } as AlreadyRegisteredError);
      ctx.status = 400;
    } else {
      logger.error("Unexpected Error on signup", err);
      ctx.body = JSON.stringify({
        error_code: "UNEXPECTED_ERROR"
      } as UnexpectedError);
      ctx.status = 500;
    }
  }
}
