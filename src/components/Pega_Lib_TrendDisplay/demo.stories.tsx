import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsTrendDisplay, type TrendDisplayProps } from './index';

export default {
  title: 'Fields/Trend Display',
  argTypes: {
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
    displayMode: {
      options: ['', 'DISPLAY_ONLY'],
      control: { type: 'radio', labels: { '': 'EDITABLE' } },
    },
    colorMode: {
      options: ['auto', 'trend', 'orange', 'blue', 'purple'],
      control: { type: 'radio' },
    },
    variant: {
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
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsTrendDisplay,
};

type Story = StoryObj<typeof PegaExtensionsTrendDisplay>;

const TrendDisplayDemo = (inputs: TrendDisplayProps) => {
  return {
    render: (args: TrendDisplayProps) => {
      const props = {
        ...args,
      };
      return <PegaExtensionsTrendDisplay {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = TrendDisplayDemo({
  value: 10000,
  trendData: '',
  label: 'Value',
  hideLabel: false,
  colorMode: 'auto',
  renderingMode: 'normal',
  displayMode: '',
  currencyISOCode: 'USD',
  currencyDisplay: 'symbol',
  negative: 'minus-sign',
  notation: 'standard',
  currencyDecimalPrecision: 'auto',
});

export const Demo1: Story = TrendDisplayDemo({
  label: '2 weeks history',
  trendData: '0,2,5,9,5,10,3,5,0,0,1,8,2,9,0',
  displayMode: '',
});

export const Demo2: Story = TrendDisplayDemo({
  label: 'CST',
  trendData: 12.4,
  colorMode: 'trend',
  displayMode: 'DISPLAY_ONLY',
});

export const Demo3: Story = TrendDisplayDemo({
  label: 'TCS',
  trendData: -3.45,
  colorMode: 'trend',
  displayMode: 'DISPLAY_ONLY',
});

export const Demo4: Story = TrendDisplayDemo({
  value: -10000,
  label: 'Amount',
  currencyISOCode: 'EUR',
  negative: 'parentheses',
  currencyDecimalPrecision: '0',
  colorMode: 'trend',
});

export const Demo5: Story = TrendDisplayDemo({
  value: 20400,
  label: 'Balance',
  currencyISOCode: 'EUR',
  notation: 'compact',
  colorMode: 'trend',
});

export const Demo2_badge: Story = TrendDisplayDemo({
  label: 'CST',
  trendData: '12.4%',
  colorMode: 'trend',
  displayMode: 'DISPLAY_ONLY',
  renderingMode: 'badge',
});

export const Demo3_badge: Story = TrendDisplayDemo({
  label: 'TCS',
  trendData: '-3.45%',
  colorMode: 'trend',
  displayMode: 'DISPLAY_ONLY',
  renderingMode: 'badge',
});

export const Demo4_badge: Story = TrendDisplayDemo({
  value: -10000,
  label: 'Amount',
  currencyISOCode: 'EUR',
  negative: 'parentheses',
  currencyDecimalPrecision: '0',
  colorMode: 'trend',
  renderingMode: 'badge',
});

export const Demo5_badge: Story = TrendDisplayDemo({
  value: 20400,
  label: 'Balance',
  currencyISOCode: 'EUR',
  notation: 'compact',
  colorMode: 'trend',
  renderingMode: 'badge',
});

export const Demo6_1: Story = TrendDisplayDemo({
  value: 20400,
  label: 'Balance',
  displayMode: 'DISPLAY_ONLY',
  colorMode: 'purple',
  renderingMode: 'badge',
});

export const Demo6_2: Story = TrendDisplayDemo({
  trendData: 23.4,
  label: 'Balance',
  displayMode: 'DISPLAY_ONLY',
  colorMode: 'blue',
  renderingMode: 'badge',
});
