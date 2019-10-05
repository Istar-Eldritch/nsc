import * as t from "io-ts";

// TODO: Create validations module
export const NonEmptyString = new t.Type<string, string, unknown>(
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
export const Email = new t.Type<string, string, unknown>(
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
