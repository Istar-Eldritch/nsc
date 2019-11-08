import * as t from "io-ts";
import { PublicUser } from "../../../db/daos";
import { Email, NonEmptyString } from "../../validations";

export const SignInCommandIO = t.interface({
  email: Email,
  password: NonEmptyString
});
export type SignInCommand = t.TypeOf<typeof SignInCommandIO>;

export interface SignInSuccess {
  result: {
    user: PublicUser;
    token: string;
  };
}

export interface UnexpectedError {
  status: 500;
  error_code: "UNEXPECTED_ERROR";
}

export interface Unauthorized {
  status: 401;
  error_code: "UNAUTHORIZED";
}

export interface InvalidPayloadError {
  status: 400;
  error_code: "INVALID_PAYLOAD";
  detail: { [k: string]: string };
}

export interface Response {
  status: number;
  body: string;
}

export function prettyfyErrors(errors: any) {
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
