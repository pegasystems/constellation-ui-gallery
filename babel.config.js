module.exports = function (api) {
  const isTest = api.env('test');
  api.cache(() => process.env.NODE_ENV);
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: isTest ? 'commonjs' : false,
      },
    ],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ];
  const plugins = [];

  return {
    presets,
    plugins,
  };
};
