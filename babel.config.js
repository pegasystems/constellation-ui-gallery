module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
          node: true
        }
      }
    ],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
};
