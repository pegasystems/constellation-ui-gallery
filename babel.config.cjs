module.exports = {
  presets: [
    [
      '@babel/preset-typescript',
      {
        onlyRemoveTypeImports: true,
        allExtensions: true,
        isTSX: true
      }
    ]
  ],
  sourceType: 'unambiguous'
};
