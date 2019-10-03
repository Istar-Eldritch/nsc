import { Context } from "koa";
import { getConnection, createUser } from "../../db";
import logger from "../../logger";
import * as t from "io-ts";
import { isRight } from "fp-ts/lib/Either";

// TODO: Create validations module
const NonEmptyString = new t.Type<string, string, unknown>(
  "String",
  t.string.is,
  (u, c) => {
    if (typeof u === "string" && u.length > 0) {
      return t.success(u);
    } else {
      if (u) {
        return t.failure(u, c, "Is not a string");
      } else {
        return t.failure(u, c, "Can't be empty");
      }
    }
  },
  String
);

const emailRegex = /.+@.+/;
const Email = new t.Type<string, string, unknown>(
  "Email",
  NonEmptyString.is,
  (u: any, c) => {
    if (emailRegex.test(u)) {
      return t.success(u);
    } else {
      return t.failure(u, c, "Is not a valid email");
    }
  },
  String
);

const CreateUserCmdIO = t.interface({
  name: NonEmptyString,
  email: Email,
  password: NonEmptyString
});

type CreateUserCmd = t.TypeOf<typeof CreateUserCmdIO>;

interface CreateUserResponse {
  result: {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
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
      delete user.password_hash;

      const response: CreateUserResponse = {
        result: user
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
