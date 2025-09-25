import { addons } from 'storybook/manager-api';
import myTheme from './theme';

addons.setConfig({
  theme: myTheme,
  enableShortcuts: false,
  showToolbar: true,
  sidebar: {
    showRoots: false,
  },
});
