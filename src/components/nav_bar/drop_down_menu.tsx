import React, { ReactNode, ReactElement, useState } from "react";
import { MenuItem } from "./menu_item";
import { Dropdown } from "../general/drop_down";

interface DropdownMenuProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function DropdownMenu(props: DropdownMenuProps): ReactElement {
  const [state, setState] = useState({ open: false });

  function onChildStateDidChange(open: boolean): void {
    setState({ open });
  }

  const className = `
    ${state.open ? "border-gray-500" : ""}
    ${props.className}
  `;

  // TODO This svg is too bulky
  return (
    <Dropdown onStateDidChange={onChildStateDidChange}>
      <MenuItem className={className}>
        <span className="inline-block">{props.label}</span>
        <svg
          className="inline-block ml-1 h-3 w-3 fill-current text-gray-600 rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 444.819 444.819"
        >
          <path d="M352.025 196.712L165.884 10.848C159.029 3.615 150.469 0 140.187 0s-18.842 3.619-25.697 10.848L92.792 32.264c-7.044 7.043-10.566 15.604-10.566 25.692 0 9.897 3.521 18.56 10.566 25.981L231.545 222.41 92.786 361.168c-7.042 7.043-10.564 15.604-10.564 25.693 0 9.896 3.521 18.562 10.564 25.98l21.7 21.413c7.043 7.043 15.612 10.564 25.697 10.564 10.089 0 18.656-3.521 25.697-10.564L352.025 248.39c7.046-7.423 10.571-16.084 10.571-25.981.001-10.088-3.525-18.654-10.571-25.697z" />
        </svg>
      </MenuItem>
      <div>{props.children}</div>
    </Dropdown>
  );
}

interface DropdownMenuItemProps {
  className?: string;
  children: ReactNode;
}

export function DropdownMenuItem(props: DropdownMenuItemProps): ReactElement {
  const classes = `
    block
    px-2
    py1
    font-hairline
    text-base
    hover:bg-gray-300
  `;

  return <div className={classes}>{props.children}</div>;
}
