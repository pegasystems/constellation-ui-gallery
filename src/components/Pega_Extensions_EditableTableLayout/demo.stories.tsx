import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsEditableTableLayout, type TableLayoutProps } from './index';
import { CurrencyInput, DateInput, Input } from '@pega/cosmos-react-core';

type configInfo = {
  value?: Array<any>;
  componentType?: string;
  label?: string;
  heading?: string;
};

type info = {
  config: configInfo;
  type: string;
  children?: Array<info>;
};

export default {
  title: 'Templates/Editable Table Layout',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'autocomplete-valid',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsEditableTableLayout,
};

const genResponse = () => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'EditableTableLayout',
      ruleClass: 'Work-',
      inheritedProps: { label: 'Edit computers' },
    },
    children: [
      {
        name: 'A',
        type: 'Region',
        children: [] as Array<info>,
        getPConnect: () => {},
      },
    ],
    classID: 'Work-MyComponents',
  };

  demoView.children[0].children = [
    {
      config: {
        value: ['HP', 'Lenovo', 'Apple'],
        componentType: 'TextInput',
        label: 'Brand',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          'Another description',
          'simple description',
        ],
        componentType: 'TextInput',
        label: 'Description',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: ['16Gb', '8Gb', '8Gb'],
        componentType: 'TextInput',
        label: 'Memory',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: ['2024-12-24', '2024-10-01', '2024-05-26'],
        componentType: 'Date',
        label: 'Release Date',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: [1200.0, 1345.0, 1499.0],
        componentType: 'Currency',
        label: 'Price',
      },
      type: 'ScalarList',
    },
    {
      config: {
        value: ['S-1', 'S-2', 'S-3'],
        componentType: 'TextInput',
        label: 'ID',
      },
      type: 'ScalarList',
    },
  ];

  demoView.children[0].getPConnect = () => {
    return {
      getRawMetadata: () => {
        return demoView.children[0];
      },
    };
  };
  return demoView;
};

type Story = StoryObj<typeof PegaExtensionsEditableTableLayout>;

export const Default: Story = {
  render: (args: TableLayoutProps) => {
    (window as any).PCore = {
      getLocaleUtils: () => {
        return {
          getLocaleValue: (val: string) => {
            return val;
          },
        };
      },
      getContextTreeManager: () => {
        return {
          addPageListNode: () => {},
        };
      },
      createPConnect: (context: any) => {
        return {
          getPConnect: () => {
            return {
              createComponent: (f: any) => {
                const index = context.options.pageReference.substring(
                  context.options.pageReference.indexOf('[') + 1,
                  context.options.pageReference.indexOf(']'),
                );
                if (f.type === 'Currency') {
                  return (
                    <CurrencyInput
                      label={context.meta.config.label}
                      labelHidden={true}
                      currencyISOCode='USD'
                      value={`${context.meta.config.value[index]}.0`}
                      onChange={() => {}}
                    />
                  );
                }
                if (f.type === 'Date') {
                  return (
                    <DateInput
                      label={context.meta.config.label}
                      labelHidden={true}
                      value={`${context.meta.config.value[index]}.0`}
                      onChange={() => {}}
                    />
                  );
                }
                return (
                  <Input
                    label={context.meta.config.label}
                    labelHidden={true}
                    value={context.meta.config.value[index]}
                  />
                );
              },
              getListActions: () => {
                return {
                  insert: () => {
                    /* nothing */
                  },
                  deleteEntry: () => {
                    /* nothing */
                  },
                };
              },
            };
          },
        };
      },
      getComponentsRegistry: () => {
        return {
          getLazyComponent: (f: string) => f,
        };
      },
    };

    const props = {
      template: 'CompareTableLayout',
      ...args,

      getPConnect: () => {
        return {
          meta: {
            name: '',
          },
          options: {
            viewName: '',
          },
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => 'workarea',
          getTarget: () => 'workarea',
          getChildren: () => {
            return genResponse().children;
          },
          getRawMetadata: () => {
            return genResponse();
          },
          getInheritedProps: () => {
            return genResponse().config.inheritedProps;
          },
          setInheritedProp: () => {
            /* nothing */
          },
          setValue: () => {
            /* nothing */
          },
          resolveConfigProps: (f: any) => {
            return { ...f, propref: f.value, pageref: 'tasks' };
          },
        };
      },
    };
    return <PegaExtensionsEditableTableLayout {...props} />;
  },
  args: {},
};
