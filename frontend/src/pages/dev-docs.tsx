import React, { ReactNode, ReactElement } from "react";
import { CodeBlock, NavBar, Dropdown } from "../components";
import "regenerator-runtime/runtime";
import jsxToString from "jsx-to-string";

interface DocsProps {
  title: string;
  children: ReactNode;
}

function Docs(props: DocsProps): ReactElement {
  return (
    <div className="container mt-12 mx-auto">
      <h1 className="text-xl">{props.title}</h1>
      <div className="shadow rounded mt-2">
        <CodeBlock className="m-0 shadow" lang="lang-html">
          {jsxToString(props.children)}
        </CodeBlock>
        <div className="p-3">{props.children}</div>
      </div>
    </div>
  );
}

export function DevDocs(): ReactElement {
  return (
    <>
      <NavBar />
      <Docs title="Dropdown">
        <Dropdown>
          <label className="cursor-pointer p-2 border">Anchlor</label>
          <div className="p2 border">Contents</div>
        </Dropdown>
      </Docs>
    </>
  );
}

//        <Docs title="Menu Item">
//          <MenuItem><Link to="/" className="text-xl">Menu Item</Link></MenuItem>
//        </Docs>
//
//
//        <Docs title="Profile Signed In">
//          <Profile data={Some({name: "Ruben Paz", avatar: None})} />
//        </Docs>
//
//        <Docs title="Profile Signed Out">
//          <Profile data={None} />
//        </Docs>
//
//
//
//        <Docs title="Dropdown Menu">
//          <DropdownMenu className="text-lg" label="Dropdown Menu">
//            <DropdownMenuItem><Link to="/">First Item</Link></DropdownMenuItem>
//
//            <DropdownMenuItem><a href="https://google.com">Second Item</a></DropdownMenuItem>
//            <DropdownMenuItem>Third Item</DropdownMenuItem>
//          </DropdownMenu>
//        </Docs>
