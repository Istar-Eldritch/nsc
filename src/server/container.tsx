import React from "react";

import asset from "./asset";

const Container = ({ children }: { children: string }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta
        name="google-site-verification"
        content="J1UZEHXZjMgo7WJ5T25Sf8SMXB8huImFfhtT1sRwP6Y"
      />
      <meta name="msvalidate.01" content="CAB41B0E51D04FAFD90F678372A059C4" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <link rel="shortcut icon" href={asset("favicon.ico")} />
      <link
        rel="icon"
        type="image/png"
        href={asset("favicon-32x32.png")}
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href={asset("favicon-16x16.png")}
        sizes="16x16"
      />
      <link rel="stylesheet" href={asset("styles.css")} />
      <script src={asset("main.js")} defer />
    </head>

    <body>
      <main id="app" dangerouslySetInnerHTML={{ __html: children }} />
    </body>
  </html>
);

export default Container;
