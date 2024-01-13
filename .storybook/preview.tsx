import type { Preview, DecoratorFn } from '@storybook/react';
import {
  Configuration,
  PopoverManager,
  Toaster,
  ModalManager,
  WorkTheme
} from '@pega/cosmos-react-core';

export const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    docs: {
      toc: true // Enables the table of contents
    }
  }
};

export const decorators: Array<DecoratorFn> = [
  (Story, context) => {
    return (
      <Configuration locale='en-US'>
        <PopoverManager>
          <Toaster dismissAfter={5000}>
            <ModalManager>
              <Story {...context} />
            </ModalManager>
          </Toaster>
        </PopoverManager>
      </Configuration>
    );
  }
];

export const parameters = {
  backgrounds: {
    default: 'App',
    values: [
      {
        name: 'App',
        value: WorkTheme.base.palette['app-background']
      },
      {
        name: 'Primary',
        value: WorkTheme.base.palette['primary-background']
      },
      {
        name: 'Secondary',
        value: WorkTheme.base.palette['secondary-background']
      }
    ]
  }
};
