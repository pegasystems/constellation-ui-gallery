import type { Preview, DecoratorFn } from '@storybook/react';
import { Configuration, PopoverManager, Toaster, ModalManager } from '@pega/cosmos-react-core';

export const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    docs: {
      toc: true
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
