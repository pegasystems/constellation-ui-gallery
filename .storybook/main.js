module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-knobs'],
  core: {
    builder: 'webpack5'
  }
};
