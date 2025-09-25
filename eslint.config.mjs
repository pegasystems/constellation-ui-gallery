// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['eslint.config.mjs', '**/dist/*', '**/*.config.{js,mjs,cjs,ts}', '**/node_modules/*'],
  },
  pluginJs.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...pluginReactHooks.configs.recommended.rules,
    },
    ignores: ['*.test.tsx'],
  }, // Custom Rules should be added below so that they overwrite any defaults in the above default setup
  {
    rules: {
      // Prettier recommends running separately from a linter.
      // https://prettier.io/docs/en/integrating-with-linters.html#notes
      'prettier/prettier': 'off',

      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/extensions': ['off', 'never'],
      'import/named': 'off',
      'import/no-cycle': 'off',
      'import/no-duplicates': 'off',
      'import/no-relative-packages': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-self-import': 'off',
      'import/no-unresolved': 'off',
      'import/no-useless-path-segments': 'off',
      'import/order': 'off',
      'jest/expect-expect': 'off',
      'testing-library/no-container': 'off',
      'testing-library/no-node-access': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
];
