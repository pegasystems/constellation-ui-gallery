import { useEffect as useReactEffect } from 'react';
import { configureActions } from 'storybook/actions';
import { css } from 'storybook/theming';
import { useEffect as useStorybookEffect, useMemo as useStorybookMemo } from 'storybook/preview-api';
import type { Preview } from '@storybook/react-webpack5';
import {
  Configuration,
  ModalManager,
  PopoverManager,
  Toaster,
  Aries2023Theme,
  Aries2023DarkTheme,
  ThemeMachine,
  BaseThemeMachine,
} from '@pega/cosmos-react-core';
import type { DefaultSettableTheme, DefaultThemeDefinition } from '@pega/cosmos-react-core';
import * as MantisTheme from './MantisTheme.json';
import * as FlameTheme from './FlameTheme.json';
import * as HoneyFlowerTheme from './HoneyFlowerTheme.json';

configureActions({
  depth: 5,
  limit: 20,
});

const themes: Record<string, DefaultSettableTheme | undefined> = {
  Default: Aries2023Theme,
  Dark: Aries2023DarkTheme,
  Mantis: MantisTheme,
  Flame: FlameTheme,
  HoneyFlower: HoneyFlowerTheme,
};

const themeMachines = Object.fromEntries(
  Object.entries(themes).map(([name, theme]) => [
    name,
    new ThemeMachine<DefaultThemeDefinition>({ theme, parent: BaseThemeMachine }),
  ]),
);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Getting Started', 'Libraries', 'Support and Contributing'],
      },
    },
    backgrounds: {
      disable: true,
      grid: {
        disable: true,
      },
    },
    outline: {
      disable: true,
    },
    controls: { hideNoControlsWarning: true },
  },

  decorators: [
    (Story, context) => {
      const direction: 'ltr' | 'rtl' = context.globals.direction;

      useReactEffect(() => {
        document.documentElement.setAttribute('dir', direction);
      }, [direction]);

      return (
        <Configuration
          theme={themes[context.globals.theme]}
          direction={direction}
          locale={context.globals.locale}
          disableDefaultFontLoading
          id='Preview'
        >
          <PopoverManager>
            <Toaster dismissAfter={5000}>
              <ModalManager>
                <Story {...context} />
              </ModalManager>
            </Toaster>
          </PopoverManager>
        </Configuration>
      );
    },

    // Sets up shadow DOM rendering
    (Story, context) => {
      const backgroundStyles = useStorybookMemo(() => {
        const selector = context.viewMode === 'docs' ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

        const maxWidth = context.globals.fullscreen !== 'On' ? '1000px' : 'none';

        const themeMachine = themeMachines[context.globals.theme];

        let background: string;

        switch (context.globals.backgrounds) {
          case 'Clear':
            background = 'transparent';
            break;
          case 'Primary Background':
            background = themeMachine.theme.base.palette['primary-background'];
            break;
          case 'Secondary Background':
            background = themeMachine.theme.base.palette['secondary-background'];
            break;
          case 'App Background':
          default:
            background = themeMachine.theme.base.palette['app-background'];
            break;
        }

        return css`
          @property --addon-backgrounds-gradient-primary {
            syntax: '<color>';
            initial-value: gray;
            inherits: false;
          }

          @property --addon-backgrounds-gradient-secondary {
            syntax: '<color>';
            initial-value: white;
            inherits: false;
          }

          :root {
            --addon-backgrounds-gradient-primary: ${themeMachine.theme.base.palette['app-background']};
            --addon-backgrounds-gradient-secondary: ${themeMachine.theme.base.palette['primary-background']};
            background: repeating-conic-gradient(
                var(--addon-backgrounds-gradient-primary) 0% 25%,
                var(--addon-backgrounds-gradient-secondary) 0% 50%
              )
              0 0 / 1rem 1rem;
            transition:
              --addon-backgrounds-gradient-primary 0.3s,
              --addon-backgrounds-gradient-secondary 0.3s;
          }

          .sb-story.sb-unstyled,
          ${selector} {
            background: ${background} !important;
            transition: background-color 0.3s;
          }

          .sbdocs-content {
            max-width: ${maxWidth}!important;
          }
        `.styles;
      }, [context.viewMode, context.globals.theme, context.globals.backgrounds, context.globals.fullscreen]);

      useStorybookEffect(() => {
        const id = context.viewMode === 'docs' ? `addon-backgrounds-docs-${context.id}` : 'addon-backgrounds-color';

        const existingStyleEl = document.getElementById(id);
        if (existingStyleEl) {
          if (existingStyleEl.innerHTML !== backgroundStyles) {
            existingStyleEl.innerHTML = backgroundStyles;
          }
        } else {
          const newStyleEl = document.createElement('style');

          newStyleEl.setAttribute('id', id);
          newStyleEl.innerHTML = backgroundStyles;

          document.head.appendChild(newStyleEl);
        }
      }, [backgroundStyles, context.viewMode, context.id]);

      return <Story {...context} />;
    },
  ],

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Change the theme of the preview',
      defaultValue: 'Default',
      toolbar: {
        icon: 'paintbrush',
        items: Object.keys(themes),
      },
    },
    backgrounds: {
      name: 'Backgrounds',
      description: 'Change the background of the preview',
      defaultValue: 'Clear',
      toolbar: {
        icon: 'photo',
        items: ['Clear', 'App Background', 'Primary Background', 'Secondary Background'],
      },
    },
    fullscreen: {
      name: 'Fullscreen',
      description: 'Use all space',
      defaultValue: 'Off',
      toolbar: {
        icon: 'grow',
        items: ['Off', 'On'],
      },
    },
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en-US',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en-US', right: '🇺🇸', title: 'English (US)' },
          { value: 'pl', right: '🇵🇱', title: 'Polish' },
          { value: 'fr', right: '🇫🇷', title: 'Français' },
          { value: 'ar', right: '🇦🇪', title: 'عربي' },
        ],
      },
    },
    direction: {
      name: 'Directionality',
      description: 'Script directionality',
      defaultValue: 'ltr',
      toolbar: {
        items: [
          { value: 'ltr', icon: 'arrowrightalt', title: 'Left to Right' },
          { value: 'rtl', icon: 'arrowleftalt', title: 'Right to Left' },
        ],
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
