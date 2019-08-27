import React, { ReactNode, ReactElement } from "react";
import { NavBar } from "../components";

interface InputProps {
  placeholder?: string;
  className?: string;
  type?: string;
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
  return <input className={classes} placeholder={props.placeholder} type={props.type} />;
}

interface FieldProps {
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  type?: string;
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
        className={`${props.error ? "border-red-800 focus:border-red-800" : ""}`}
      />
      <label className="text-xs text-red-800 h-3">{props.error}</label>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
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

  return <button className={classes}>{props.children}</button>;
}

export function SignUp(): ReactElement {
  return (
    <>
      <NavBar />
      <div className="container mx-auto block mt-16 flex flex-col">
        <div className="mx-auto flex flex-col shadow p-8">
          <h1 className="mb-8 text-2xl">Sign In</h1>

          <Field placeholder="Email" className="mb-4" type="email" error="" />
          <Field placeholder="Password" className="mb-8" type="password" error="Invalid password" />
          <Field
            placeholder="Repeat Password"
            className="mb-8"
            type="password"
            error="Invalid password"
          />

          <Button className="text-lg p-2">Submit</Button>
        </div>
      </div>
    </>
  );
}

export function SignIn(): ReactElement {
  return (
    <>
      <NavBar />
      <div className="container mx-auto block mt-16 flex flex-col">
        <div className="mx-auto flex flex-col shadow p-8">
          <h1 className="mb-8 text-2xl">Sign In</h1>

          <Field placeholder="Email" className="mb-4" type="email" error="" />
          <Field placeholder="Password" className="mb-8" type="password" error="Invalid password" />

          <Button className="text-lg p-2">Submit</Button>
        </div>
      </div>
    </>
  );
}
