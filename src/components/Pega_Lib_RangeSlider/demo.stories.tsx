import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsRangeSlider } from './index';

export default {
  title: 'Templates/Range Slider',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsRangeSlider,
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
      children: [],
    },
  ],
  classID: 'Work-MyComponents',
};

type Story = StoryObj<typeof PegaExtensionsRangeSlider>;
export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {},
              refreshCaseView: () => {},
            };
          },
          getCaseInfo: () => {
            return {
              getCurrentAssignmentViewName: () => '',
              getKey: () => {
                return 'WORK-123';
              },
            };
          },
          getChildren: () => {
            return mainResponse.children;
          },
          getRawMetadata: () => {
            return mainResponse;
          },
          getInheritedProps: () => {
            return mainResponse.config.inheritedProps;
          },
          createComponent: () => {},
          setInheritedProp: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          },
        };
      },
    };
    const regionAChildren = mainResponse.children[0].children.map(() => {
      return props.getPConnect().createComponent();
    });

    return <PegaExtensionsRangeSlider {...props}>{regionAChildren}</PegaExtensionsRangeSlider>;
  },
  args: {
    label: 'Range Slider',
    showLabel: true,
    maxValueProperty: 240,
    minValueProperty: 120,
    min: 0,
    max: 500,
    step: 1,
    currencyCode: 'USD',
  },
};
