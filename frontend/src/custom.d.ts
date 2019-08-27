declare module "*.svg" {
  // eslint-disable-next-line
  const content: any;
  export default content;
}

declare module "jsx-to-string" {
  // eslint-disable-next-line
  function jsxToString(e: any): string;
  export default jsxToString;
}
