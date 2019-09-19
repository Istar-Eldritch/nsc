module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: false,
          targets: {
            node: true,
            browsers: "> 5%",
          },
        },
      ],
      "@babel/preset-typescript",
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      [
        "@babel/plugin-proposal-class-properties",
        {
          loose: true,
        },
      ],
    ],
  };
};
