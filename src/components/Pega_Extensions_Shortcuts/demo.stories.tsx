import type { StoryObj } from '@storybook/react';
import PegaExtensionsShortcuts from './index';

export default {
  title: 'Widgets/Shortcuts',
  argTypes: {
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsShortcuts
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {}
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return { ACTION_SHOWVIEW: 'ACTION_SHOWVIEW' };
        }
      };
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsShortcuts>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => '',
          getValue: () => 'C-123',
          getActionsApi: () => {
            return {
              showPage: (name: string, classname: string) => {
                // eslint-disable-next-line no-alert
                alert(`show page ${classname}.${name}`);
              }
            };
          }
        };
      }
    };
    return <PegaExtensionsShortcuts {...props} />;
  },
  args: {
    heading: 'Shortcuts',
    names: 'Welcome,Information,Help,My Search',
    pages: 'Data-Portal.Page1,Data-Portal.Page2,Work-.Page3,https://www.pega.com'
  }
};
