import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsCompareTableLayout, type TableLayoutProps } from './index';
import { CurrencyDisplay } from '@pega/cosmos-react-core';

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
  title: 'Templates/Compare Table Layout',
  argTypes: {
    selectionProperty: {
      options: ['Select an object', 'Read-only'],
      control: { type: 'radio' },
      if: { arg: 'displayFormat', neq: 'radio-button-card' },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsCompareTableLayout,
};

const genComponent = (config: any, format: any) => {
  if (config.type === 'Currency') {
    if (config.config.negative === 'parentheses') {
      return (
        <CurrencyDisplay
          currencyISOCode='USD'
          value={config.config.value}
          formattingOptions={{
            negative: 'parentheses',
            notation: 'standard',
          }}
        />
      );
    }
    return (
      <CurrencyDisplay
        currencyISOCode='USD'
        value={config.config.value}
        formattingOptions={{
          notation: format,
        }}
      />
    );
  }
  return config.config.text;
};

const genResponse = (displayFormat: string, selectionProperty: string) => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'CompareTableLayout',
      ruleClass: 'Work-',
      ...(selectionProperty ? { selectionProperty } : ''),
      inheritedProps: [],
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

  if (displayFormat !== 'financialreport') {
    demoView.children[0].children = [
      {
        config: {
          value: ['HP 14-inch HD Thin & Light Laptop', 'Lenovo IdeaCentre 5i', 'MacBook Air'],
          componentType: 'TextInput',
          label: 'Model',
        },
        type: 'ScalarList',
      },
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
          value: [true, true, false],
          componentType: 'Checkbox',
          label: 'Windows 10',
        },
        type: 'ScalarList',
      },
      {
        config: {
          value: [true, true, true],
          componentType: 'Checkbox',
          label: 'HDMI Port',
        },
        type: 'ScalarList',
      },
      {
        config: {
          value: [false, true, false],
          componentType: 'Checkbox',
          label: 'USB Port',
        },
        type: 'ScalarList',
      },
      {
        config: {
          value: [1200, 1345, 1499],
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
  } else {
    demoView.children[0].children = [
      {
        config: {
          value: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
          componentType: 'TextInput',
          label: 'ID',
        },
        type: 'ScalarList',
      },
      {
        config: {
          heading: 'ASSETS',
        },
        type: 'Group',
      },
      {
        config: {
          heading: 'Current Assets',
        },
        type: 'Group',
        children: [
          {
            config: {
              value: [12000, 15000, 1600, -18000],
              componentType: 'Currency',
              label: 'Cash and cash equivalents',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [32000, 45000, 67600, 68000],
              componentType: 'Currency',
              label: 'Trade and other receivables',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [-52000, 34000, -1600, 28000],
              componentType: 'Currency',
              label: 'Other current financial assets',
            },
            type: 'ScalarList',
          },
        ],
      },
      {
        config: {
          value: [122000, 134000, 23600, 128000],
          componentType: 'Currency',
          label: 'Total current assets',
        },
        type: 'ScalarList',
      },
      {
        config: {
          heading: 'Non-current Assets',
        },
        type: 'Group',
        children: [
          {
            config: {
              value: [12000, 15000, 1600, -18000],
              componentType: 'Currency',
              label: 'Property, plant and equipment',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [32000, 45000, 67600, 68000],
              componentType: 'Currency',
              label: 'Goodwill',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [-52000, 34000, -1600, 28000],
              componentType: 'Currency',
              label: 'Deferred tax assets',
            },
            type: 'ScalarList',
          },
        ],
      },
      {
        config: {
          value: [122000, 134000, 23600, 128000],
          componentType: 'Currency',
          label: 'Total non-current assets',
        },
        type: 'ScalarList',
      },
      {
        config: {
          value: [4122000, 4134000, 233600, 1238000],
          componentType: 'Currency',
          label: 'Total assets',
        },
        type: 'ScalarList',
      },
      {
        config: {
          heading: 'LIABILITIES',
        },
        type: 'Group',
      },
      {
        config: {
          heading: 'Current liabilities',
        },
        type: 'Group',
        children: [
          {
            config: {
              value: [12000, 15000, 1600, -18000],
              componentType: 'Currency',
              label: 'Trade and other payables',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [32000, 45000, 67600, 68000],
              componentType: 'Currency',
              label: 'Lease liabilities',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [-52000, 34000, -1600, 28000],
              componentType: 'Currency',
              label: 'Provisions',
            },
            type: 'ScalarList',
          },
        ],
      },
      {
        config: {
          value: [122000, 134000, 23600, 128000],
          componentType: 'Currency',
          label: 'Total current liabilities',
        },
        type: 'ScalarList',
      },
      {
        config: {
          heading: 'Non-current Liabilities',
        },
        type: 'Group',
        children: [
          {
            config: {
              value: [12000, 15000, 1600, -18000],
              componentType: 'Currency',
              label: 'Lease liabilities',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [32000, 45000, 67600, 68000],
              componentType: 'Currency',
              label: 'Deferred tax liabilities',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [-52000, 34000, -1600, 28000],
              componentType: 'Currency',
              label: 'Derivative financial liabilities',
            },
            type: 'ScalarList',
          },
          {
            config: {
              value: [122000, 134000, 23600, 128000],
              componentType: 'Currency',
              label: 'Total non-current liabilities',
            },
            type: 'ScalarList',
          },
        ],
      },
      {
        config: {
          value: [4122000, 4134000, 233600, 1238000],
          componentType: 'Currency',
          label: 'Total Liabilities',
        },
        type: 'ScalarList',
      },
    ];
    if (selectionProperty) {
      demoView.children[0].children.push({
        config: {
          value: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
          componentType: 'TextInput',
          label: 'ID',
        },
        type: 'ScalarList',
      });
    }
  }
  demoView.children[0].getPConnect = () => {
    return {
      getRawMetadata: () => {
        return demoView.children[0];
      },
    };
  };
  return demoView;
};

type Story = StoryObj<typeof PegaExtensionsCompareTableLayout>;

const CompareTableDemo = (inputs: TableLayoutProps) => {
  return {
    render: (args: TableLayoutProps) => {
      (window as any).PCore = {
        getLocaleUtils: () => {
          return {
            getLocaleValue: (val: string) => {
              return val;
            },
          };
        },
        getComponentsRegistry: () => {
          return {
            getLazyComponent: (f: string) => f,
          };
        },
      };
      const selProp = args.selectionProperty === 'Select an object' ? '.prop1' : '';
      const props = {
        template: 'CompareTableLayout',
        ...args,
        selectionProperty: selProp,
        getPConnect: () => {
          return {
            getLocalizedValue: (val: string) => {
              return val;
            },
            getChildren: () => {
              return genResponse(args.displayFormat, selProp).children;
            },
            getRawMetadata: () => {
              return genResponse(args.displayFormat, selProp);
            },
            getInheritedProps: () => {
              return genResponse(args.displayFormat, selProp).config.inheritedProps;
            },
            createComponent: (config: any) => {
              return genComponent(config, args.currencyFormat);
            },
            setInheritedProp: () => {
              /* nothing */
            },
            setValue: () => {
              /* nothing */
            },
            resolveConfigProps: (f: string) => {
              return f;
            },
            getActionsApi: () => {
              return {
                updateFieldValue: () => {},
                triggerFieldChange: () => {},
              };
            },
          };
        },
      };
      return <PegaExtensionsCompareTableLayout {...props}></PegaExtensionsCompareTableLayout>;
    },
    args: inputs,
  };
};

export const Default: Story = CompareTableDemo({
  heading: 'Heading',
  displayFormat: 'spreadsheet',
  currencyFormat: 'standard',
  selectionProperty: 'Select an object',
});

export const RadioButton: Story = CompareTableDemo({
  heading: 'Radio-button',
  displayFormat: 'radio-button-card',
  currencyFormat: 'standard',
  selectionProperty: 'Select an object',
});

export const FinancialReport: Story = CompareTableDemo({
  heading: 'Financial report',
  displayFormat: 'financialreport',
  currencyFormat: 'standard',
  selectionProperty: 'Select an object',
});
