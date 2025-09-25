import type { StoryObj } from '@storybook/react-webpack5';
import { Input } from '@pega/cosmos-react-core';
import { PegaExtensionsFormFullWidth } from './index';

export default {
  title: 'Templates/Form Full Width',
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
  component: PegaExtensionsFormFullWidth,
};

const generateChildren = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    type: 'Text',
    config: {
      value: '',
      label: `@L Field${index + 1}`,
    },
    key: index.toString(),
  }));
};

const mainResponse = {
  name: 'pyReview',
  type: 'View',
  config: {
    template: 'Details',
    ruleClass: 'Work-MyComponents',
    showLabel: true,
    label: '@L Details',
    localeReference: '@LR Details',
    inheritedProps: [],
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return mainResponse.children[0];
          },
        };
      },
      children: generateChildren(16),
    },
  ],
  classID: 'Work-MyComponents',
};

// Create stable references outside of render
const getPConnect = () => {
  return {
    getChildren: () => {
      return mainResponse.children;
    },
    getRawMetadata: () => {
      return mainResponse;
    },
    getInheritedProps: () => {
      return mainResponse.config.inheritedProps;
    },
    createComponent: (f: any) => {
      return createComponent(f.config, f.key);
    },
    setInheritedProp: () => {
      /* nothing */
    },
    resolveConfigProps: () => {
      /* nothing */
    },
  };
};

const createComponent = (config: any, key: string) => {
  return <Input key={key} label={config.label.replace('@L ', '')} />;
};

type Story = StoryObj<typeof PegaExtensionsFormFullWidth>;
export const Default: Story = {
  render: (args) => {
    const props = {
      template: 'FieldGroupAsRow',
      ...args,
      getPConnect,
    };
    const regionAChildren = mainResponse.children[0].children.map((child: any) => {
      return getPConnect().createComponent(child);
    });

    return <PegaExtensionsFormFullWidth {...props}>{regionAChildren}</PegaExtensionsFormFullWidth>;
  },
  args: {
    heading: 'Heading',
    NumCols: '2',
    gridTemplateColumns: '',
  },
};
