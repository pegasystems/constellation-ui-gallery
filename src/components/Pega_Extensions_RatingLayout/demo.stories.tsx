import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsRatingLayout, type RatingLayoutProps } from './index';

// Define extended props for the story
interface StoryRatingLayoutProps extends RatingLayoutProps {
  numCategories: number;
  numRatings: number;
}

type configInfo = {
  values?: Array<any>;
  value?: string;
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
  title: 'Templates/Rating Layout',
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
            id: 'aria-valid-attr-value',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsRatingLayout,
};

const genComponent = (config: any) => {
  return config.config.text;
};

const setPCore = () => {
  (window as any).PCore = {
    createPConnect: () => ({
      getPConnect: () => ({
        getActionsApi: () => ({ updateFieldValue: () => {} }),
      }),
    }),
  };
};

const genResponse = (numCategories?: number, numRatings?: number) => {
  const demoView = {
    name: 'demoView',
    type: 'View',
    config: {
      template: 'RatingLayout',
      ruleClass: 'Work-',
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
  const objects_categories = [];
  const objects_labels = [];
  const objects_values = [];
  if (numCategories && numRatings) {
    for (let i = 1; i <= numCategories; i += 1) {
      for (let j = 1; j <= numRatings; j += 1) {
        objects_categories.push(`Category #${i}`);
        objects_labels.push(`Category #${i} - label #${j}`);
        objects_values.push(Math.floor(Math.random() * 5) + 1);
      }
    }
  }
  demoView.children[0].children = [
    {
      config: {
        values: objects_categories,
        value: '@FILTERED_LIST .Ratings[].Category',
      },
      type: 'ScalarList',
    },
    {
      config: {
        values: objects_labels,
        value: '@FILTERED_LIST .Ratings[].Label',
      },
      type: 'ScalarList',
    },
    {
      config: {
        values: objects_values,
        value: '@FILTERED_LIST .Ratings[].Value',
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
type Story = StoryObj<StoryRatingLayoutProps>;

export const Default: Story = {
  render: (args) => {
    const response = genResponse(args.numCategories, args.numRatings);
    setPCore();
    const props = {
      template: 'RatingLayout',
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getListActions: () => {
            return {
              update: () => {},
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {},
            };
          },
          getChildren: () => {
            return response.children;
          },
          getRawMetadata: () => {
            return response;
          },
          getInheritedProps: () => {
            return response.config.inheritedProps;
          },
          getContextName: () => {
            return 'primary';
          },
          getTarget: () => {
            return 'caseInfo';
          },
          createComponent: (config: any) => {
            return genComponent(config);
          },
          setInheritedProp: () => {
            /* nothing */
          },
          setValue: () => {
            /* nothing */
          },
          resolveConfigProps: (f: any) => {
            return { value: f.values };
          },
        };
      },
    };
    return <PegaExtensionsRatingLayout {...props}></PegaExtensionsRatingLayout>;
  },
  args: {
    minWidth: '40ch',
    numCategories: 3,
    numRatings: 3,
    label: 'Ratings',
    showLabel: true,
  },
};
