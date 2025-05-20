import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  core: {
    disableTelemetry: true
  },
  framework: '@storybook/react-webpack5',
  staticDirs: ['./static'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel'
  ],
  docs: {
    autodocs: true
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  }
};

export default config;
