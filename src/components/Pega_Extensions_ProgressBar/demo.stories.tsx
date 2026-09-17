import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { configProps, stateProps } from './mock';
import { PegaExtensionsProgressBar, type PegaExtensionsProgressBarProps } from './index';

type StoryArgs = Omit<PegaExtensionsProgressBarProps, 'getPConnect'>;

const renderProgressBar = (args: StoryArgs) => {
  const props = {
    ...args,
    getPConnect: () =>
      ({
        getStateProps: () => stateProps,
        getLocalizedValue: (text: string) => text,
      }) as unknown as typeof PConnect,
  };

  return <PegaExtensionsProgressBar {...props} />;
};

const StoryComponent = (args: StoryArgs) => renderProgressBar(args);

const meta = {
  title: 'Fields/Progress Bar',
  component: StoryComponent,
  argTypes: {
    tone: {
      options: ['accent', 'success', 'warning', 'danger'],
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['compact', 'regular', 'large'],
      control: {
        type: 'inline-radio',
      },
    },
    displayMode: {
      options: ['', 'DISPLAY_ONLY'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: renderProgressBar,
  args: configProps,
};

export const Complete: Story = {
  render: renderProgressBar,
  args: {
    ...configProps,
    label: 'Release readiness',
    value: 100,
    tone: 'success',
    helperText: 'All planned release checks are complete.',
  },
};

export const AtRisk: Story = {
  render: renderProgressBar,
  args: {
    ...configProps,
    label: 'Migration readiness',
    value: 42,
    tone: 'warning',
    size: 'large',
    helperText: 'A few critical dependencies still need attention.',
  },
};

export const Indeterminate: Story = {
  render: renderProgressBar,
  args: {
    ...configProps,
    label: 'Preparing workspace',
    value: 0,
    indeterminate: true,
    showValue: true,
    helperText: 'The current operation is still being calculated.',
  },
};
