import React, { ReactElement } from "react";
import { Option } from "funfix";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  name: string;
  avatar: Option<string>;
}

interface ProfileProps {
  className?: string;
  data: Option<UserProfile>;
}

export function Profile(props: ProfileProps): ReactElement {
  const classes = `
    ${props.className}
  `;

  return (
    <div className={classes}>
      {props.data
        .map(profile => {
          return <span key={profile.id}>{profile.name}</span>;
        })
        .getOrElseL(() => {
          return (
            <div>
              <Link className="font-bold" to="/auth/signin">
                Sign In
              </Link>
              <Link className="ml-4" to="/auth/signup">
                Sign Up
              </Link>
            </div>
          );
        })}
    </div>
  );
}
