import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { configProps, mockDataPageResponse } from './mock';
import PegaExtensionsCustomKPIGauge from './index';

/* Fake PCore so the component can fetch mock data in Storybook */
(window as any).PCore = {
  getDataApiUtils: () => ({
    getData: () => Promise.resolve(mockDataPageResponse)
  })
};

const meta: Meta<typeof PegaExtensionsCustomKPIGauge> = {
  title: 'PegaExtensionsCustomKPIGauge',
  component: PegaExtensionsCustomKPIGauge,
  excludeStories: /.*Data$/,
  argTypes: {
    label: {
      control: { type: 'text' }
    },
    subtitle: {
      control: { type: 'text' }
    },
    dataPageName: {
      control: { type: 'text' }
    },
    propertyName: {
      control: { type: 'text' }
    },
    valueUnit: {
      control: { type: 'text' }
    },
    minValue: {
      control: { type: 'number' }
    },
    maxValue: {
      control: { type: 'number' }
    },
    thresholdLow: {
      control: { type: 'number' }
    },
    thresholdHigh: {
      control: { type: 'number' }
    },
    targetValue: {
      control: { type: 'text' }
    },
    targetLabel: {
      control: { type: 'text' }
    },
    colorBelowLow: {
      control: { type: 'color' }
    },
    colorBetween: {
      control: { type: 'color' }
    },
    colorAboveHigh: {
      control: { type: 'color' }
    },
    showLegend: {
      control: { type: 'boolean' }
    },
    legendLowLabel: {
      control: { type: 'text' }
    },
    legendWarningLabel: {
      control: { type: 'text' }
    },
    legendGoodLabel: {
      control: { type: 'text' }
    },
    getPConnect: {
      table: { disable: true }
    }
  }
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsCustomKPIGauge>;

export const BasePegaExtensionsCustomKPIGauge: Story = {
  render: (args: any) => {
    const props = {
      getPConnect: () => {
        return {
          getContextName: () => 'app/primary_1',
          getStateProps: () => ({}),
          getActionsApi: () => {
            return {
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              }
            };
          },
          ignoreSuggestion: () => {
            /* nothing */
          },
          acceptSuggestion: () => {
            /* nothing */
          },
          setInheritedProps: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          }
        };
      }
    };

    return <PegaExtensionsCustomKPIGauge {...props} {...args} />;
  },
  args: {
    label: configProps.label,
    subtitle: configProps.subtitle,
    dataPageName: configProps.dataPageName,
    propertyName: configProps.propertyName,
    valueUnit: configProps.valueUnit,
    minPropertyName: configProps.minPropertyName,
    maxPropertyName: configProps.maxPropertyName,
    minValue: configProps.minValue,
    maxValue: configProps.maxValue,
    thresholdLowPropertyName: configProps.thresholdLowPropertyName,
    thresholdLow: configProps.thresholdLow,
    thresholdHighPropertyName: configProps.thresholdHighPropertyName,
    thresholdHigh: configProps.thresholdHigh,
    targetValuePropertyName: configProps.targetValuePropertyName,
    targetValue: configProps.targetValue,
    targetLabel: configProps.targetLabel,
    colorBelowLow: configProps.colorBelowLow,
    colorBetween: configProps.colorBetween,
    colorAboveHigh: configProps.colorAboveHigh,
    showLegend: configProps.showLegend,
    legendLowLabel: configProps.legendLowLabel,
    legendWarningLabel: configProps.legendWarningLabel,
    legendGoodLabel: configProps.legendGoodLabel
  }
};
