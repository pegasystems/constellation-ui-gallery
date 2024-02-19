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
  const plugins = [
    ['@babel/plugin-transform-modules-commonjs'],
    ['@babel/plugin-transform-destructuring'],
    ['@babel/plugin-transform-template-literals'],
    ['@babel/plugin-transform-classes']
  ];

  return {
    presets,
    plugins
  };
};
