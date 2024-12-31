import type { StoryObj } from '@storybook/react';
import { PegaExtensionsRangeSlider } from './index';

export default {
  title: 'Templates/Range Slider',
  argTypes: {
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsRangeSlider
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
    inheritedProps: []
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return mainResponse.children[0];
          }
        };
      },
      children: []
    }
  ],
  classID: 'Work-MyComponents'
};

type Story = StoryObj<typeof PegaExtensionsRangeSlider>;
export const Default: Story = {
  render: args => {
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getActionsApi: () => {
            return {
              refreshCaseView: () => {
                // console.log('updating views');
              }
            };
          },
          getCaseInfo: () => {
            return {
              getCurrentAssignmentViewName: () => '',
              getKey: () => {
                return 'WORK-123';
              }
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
          createComponent: (config: any) => {},
          setInheritedProp: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          }
        };
      }
    };
    const regionAChildren = mainResponse.children[0].children.map((child: any) => {
      return props.getPConnect().createComponent(child);
    });

    return <PegaExtensionsRangeSlider {...props}>{regionAChildren}</PegaExtensionsRangeSlider>;
  },
  args: {
    heading: 'Range Slider',
    min: 0,
    max: 500,
    step: 1,
    currencyCode: 'USD'
  }
};
