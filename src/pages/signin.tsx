import React, {
  ReactNode,
  ReactElement,
  useState,
  FormEvent,
  ChangeEvent
} from "react";
import { NavBar } from "../components";
import { pipe } from "fp-ts/lib/pipeable";
import { getOrElse, map as mapEither } from "fp-ts/lib/Either";
import {
  prettyfyErrors,
  SignInCommandIO
} from "../server/api/auth/signin/interfaces";

interface InputProps {
  placeholder?: string;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Input(props: InputProps): ReactElement {
  const classes = `
    border
    p-2
    text-xl
    bg-gray-100
    border-transparent
    focus:bg-white
    focus:border-gray-300
    focus:outline-0
    rounded
    ${props.className} 
  `;
  return (
    <input
      className={classes}
      placeholder={props.placeholder}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

interface FieldProps {
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Field(props: FieldProps): ReactElement {
  const classes = `
    flex flex-col
    ${props.className}
  `;

  return (
    <div className={classes}>
      {props.label ? <span className="mb-2">{props.label}</span> : ""}
      <Input
        placeholder={props.placeholder}
        type={props.type}
        className={`${
          props.error ? "border-red-800 focus:border-red-800" : ""
        }`}
        onChange={props.onChange}
        value={props.value}
      />
      <label className="text-xs text-red-800 h-3">{props.error}</label>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

function Button(props: ButtonProps): ReactElement {
  const classes = `
    p-1
    border
    rounded
    bg-gray-200
    text-gray-700
    border-transparent
    hover:bg-gray-200
    hover:text-gray-900
    hover:border-gray-300
    active:bg-gray-200
    ${props.className}
  `;

  return (
    <button className={classes} disabled={props.disabled}>
      {props.children}
    </button>
  );
}

export function SignUp(): ReactElement {
  return (
    <>
      <NavBar />
      <div className="container mx-auto block mt-16 flex flex-col">
        <form className="mx-auto flex flex-col shadow p-8">
          <h1 className="mb-8 text-2xl">Sign In</h1>

          <Field placeholder="Email" className="mb-4" type="email" error="" />
          <Field
            placeholder="Password"
            className="mb-8"
            type="password"
            error="Invalid password"
          />
          <Field
            placeholder="Repeat Password"
            className="mb-8"
            type="password"
            error="Password is too short"
          />

          <Button className="text-lg p-2">Submit</Button>
        </form>
      </div>
    </>
  );
}

export function SignIn(): ReactElement {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function validate(): string[] {
    return pipe(
      SignInCommandIO.decode({ email, password }),
      mapEither(() => []),
      getOrElse(err => {
        const reasons = prettyfyErrors(err);
        const errors = [];
        if (reasons.email) {
          errors.push("The email inserted is not valid");
        }
        if (reasons.password) {
          errors.push(`Password: ${reasons.password}`);
        }
        return errors;
      })
    );
  }

  const errors = validate();
  console.log("Errors", errors);
  const errorHTML = (
    <ul className={errors.length === 0 ? "display: none" : ""}>
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );

  return (
    <>
      <NavBar />
      <div className="container mx-auto block mt-16 flex flex-col">
        <div className="mx-auto flex flex-col shadow p-8">
          <form onSubmit={onSubmit}>
            <h1 className="mb-8 text-2xl">Sign In</h1>

            <Field
              placeholder="Email"
              className="mb-4"
              type="email"
              error=""
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Field
              placeholder="Password"
              className="mb-8"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {errorHTML}

            <Button className="text-lg p-2" disabled={errors.length > 0}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
