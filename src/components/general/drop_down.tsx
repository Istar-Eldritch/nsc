import React, { RefObject, ReactNode, useEffect, useState, ReactElement } from "react";

interface DropdownProps {
  className?: string;
  open?: boolean;
  onStateDidChange?: (open: boolean) => void;
  children: [ReactNode, ReactNode];
}

export function Dropdown(props: DropdownProps): ReactElement {
  const ref: RefObject<HTMLDivElement> = React.createRef();

  const [state, setState] = useState({ ref, open: props.open || false });

  const onClick = (): void => {
    props.onStateDidChange && props.onStateDidChange(!state.open);
    setState({ ...state, open: !state.open });
  };

  // Close the popup if we click ouside of the element
  const onClickOut = (e: Event): void => {
    const is_element = state.ref.current && state.ref.current.contains(e.target as Element);
    if (!is_element && state.open) {
      props.onStateDidChange && props.onStateDidChange(false);
      setState({ ...state, open: false });
    }
  };

  useEffect(() => {
    // Start listenining for all clicks on the page to close the modal
    document.addEventListener("mouseup", onClickOut, { passive: true });

    // Stop listening for all clicks on the page
    return () => document.removeEventListener("mouseup", onClickOut);
  });

  const popOverClassName = `
    absolute
    bg-white
    mt-1
    rounded
    shadow-lg
    overflow-hidden
    ${state.open ? "" : "hidden"}
    ${props.className}
  `;

  return (
    <div ref={state.ref}>
      <div onClick={onClick}>{props.children[0]}</div>
      <div className={popOverClassName}>{props.children[1]}</div>
    </div>
  );
}
