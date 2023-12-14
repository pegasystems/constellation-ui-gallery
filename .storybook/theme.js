import { create } from '@storybook/theming/create';

import logo from './pega-logo.svg';

const primaryColor = '#005EA7';
const secondaryColor = '#0076D1';
const purple = '#433254';
const black = '#262626';
const white = '#F0F0F0';

export default create({
  base: 'light',

  colorPrimary: secondaryColor,
  colorSecondary: purple,

  // UI
  appBg: 'white',
  appContentBg: 'white',
  appBorderColor: '#D6DBE1',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: black,
  textInverseColor: white,

  // Toolbar default and active colors
  barTextColor: black,
  barSelectedColor: secondaryColor,
  barBg: white,

  // Form colors
  inputBg: 'white',
  inputBorder: primaryColor,
  inputTextColor: black,
  inputBorderRadius: 4,

  brandTitle: 'Pega Component System',
  brandImage: logo
});
