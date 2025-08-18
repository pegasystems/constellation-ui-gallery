const packagesToTranspile = [
  '@pega/cosmos-react-core',
  '@pega/cosmos-react-social',
  '@pega/cosmos-react-rte',
  '@pega/cosmos-react-work',
  'shortcuts',
  'preact',
];
const packagesToTranspileStr = packagesToTranspile.map((p) => `${p}`).join('|');

module.exports = {
  preset: 'ts-jest',
  verbose: true,
  moduleNameMapper: {
    shortcuts: '<rootDir>/node_modules/shortcuts/dist/index.js',
  },
  collectCoverageFrom: ['src/components/**/*.{ts,tsx,js,jsx}', '!**/*.(test|stories).{ts,tsx,js,jsx}'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['./setupFiles.ts'],
  setupFilesAfterEnv: ['./setupTests.ts'],
  transformIgnorePatterns: [`node_modules/(?!(${packagesToTranspileStr}))`],
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
};
