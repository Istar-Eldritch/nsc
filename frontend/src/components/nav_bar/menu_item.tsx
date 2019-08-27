import React, { ReactNode, ReactElement } from "react";

interface MenuItemProps {
  className?: string;
  children: ReactNode;
}

export function MenuItem(props: MenuItemProps): ReactElement {
  const classes = `
    cursor-pointer
    inline-block
    border-b-2
    hover:border-gray-500
    ${props.className}
  `;

  return <div className={classes}>{props.children}</div>;
}
