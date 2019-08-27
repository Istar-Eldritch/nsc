import React, { useEffect, ReactElement } from "react";
import Prism from "prismjs";

interface CodeBlockProps {
  className?: string;
  lang: string;
  children: string;
}

export function CodeBlock(props: CodeBlockProps): ReactElement {
  useEffect(() => {
    Prism.highlightAll();
  });

  const classes = `
    ${props.className}
  `;

  return (
    <pre className={classes}>
      <code className={props.lang}>{props.children}</code>
    </pre>
  );
}
