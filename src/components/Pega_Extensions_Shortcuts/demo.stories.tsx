import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsShortcuts } from './index';

export default {
  title: 'Widgets/Shortcuts',
  argTypes: {
    heading: { control: 'text', if: { arg: 'displayType', eq: 'simple' } },
    names: { control: 'text', if: { arg: 'displayType', eq: 'simple' } },
    pages: { control: 'text', if: { arg: 'displayType', eq: 'simple' } },
    pageJSON: { control: 'text', if: { arg: 'displayType', neq: 'simple' } },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsShortcuts,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return { ACTION_SHOWVIEW: 'ACTION_SHOWVIEW' };
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsShortcuts>;
export const Default: Story = {
  render: (args) => {
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
                alert(`show page ${classname}.${name}`);
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsShortcuts {...props} />;
  },
  args: {
    displayType: 'simple',
    heading: 'Shortcuts',
    names: 'Welcome,Information,Help,My Search',
    pages: 'Data-Portal.Page1,Data-Portal.Page2,Work-.Page3,https://www.pega.com',
    pageJSON:
      '{"categories": [{ "heading": "Category1", "links" : [{ "name": "Page1" , "page": "Data-Portal.Page1"}, { "name": "Page2" , "page": "Data-Portal.Page2"},{ "name": "Page3" , "page": "Data-Portal.Page3"}]},{ "heading": "Category2", "links" : [{ "name": "Page4" , "page": "Data-Portal.Page4"}, { "name": "Page5" , "page": "Data-Portal.Page5"},{ "name": "Page6" , "page": "Data-Portal.Page6"}]},{ "heading": "Category3", "links" : [{ "name": "Welcome" , "page": "Data-Portal.Page1"}, { "name": "Information" , "page": "Data-Portal.Page2"},{ "name": "Help" , "page": "Data-Portal.Page3"}]}]}',
  },
};
