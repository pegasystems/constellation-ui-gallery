import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { configProps, rapidProgressSteps, mockCompleteDataPageResponse } from './mock';
import { PegaExtensionsProgressBar, type PegaExtensionsProgressBarProps } from './index';

type StoryArgs = Omit<PegaExtensionsProgressBarProps, 'getPConnect'>;

const renderProgressBar = (args: StoryArgs) => {
  const props = {
    ...args,
    getPConnect: () =>
      ({
        getValue: () => 'WORK-1',
        getLocalizedValue: (text: string) => text,
        getContextName: () => 'primary',
      }) as unknown as typeof PConnect,
  };

  return <PegaExtensionsProgressBar {...props} />;
};

/* Fake PCore so the widget can fetch and subscribe via the messaging service in Storybook */
const stubPCore = (getData: () => Promise<unknown>) => {
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({ getData }),
    getMessagingServiceManager: () => ({
      subscribe: () => 'subscription-id',
      unsubscribe: () => {},
    }),
  } as unknown as typeof PCore;
};

/* Simulates the messaging service pushing a rapid succession of progress updates, roughly once a second */
const stubPCoreWithRapidUpdates = (steps: number[], intervalMs = 1000) => {
  let step = 0;
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: steps[step], Max: 100 }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe: (_filter: unknown, handler: () => void) => {
        const intervalId = window.setInterval(() => {
          if (step < steps.length - 1) step += 1;
          handler();
        }, intervalMs);
        return String(intervalId);
      },
      unsubscribe: (subscriptionId: string) => window.clearInterval(Number(subscriptionId)),
    }),
  } as unknown as typeof PCore;
};

const StoryComponent = (args: StoryArgs) => {
  stubPCoreWithRapidUpdates(rapidProgressSteps);
  return renderProgressBar(args);
};

const meta = {
  title: 'Widgets/Progress Bar',
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
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    stubPCoreWithRapidUpdates(rapidProgressSteps);
    return renderProgressBar(args);
  },
  args: configProps,
};

export const Complete: Story = {
  render: (args) => {
    stubPCore(() => Promise.resolve(mockCompleteDataPageResponse));
    return renderProgressBar(args);
  },
  args: {
    ...configProps,
    label: 'Backup job progress',
    tone: 'success',
    helperText: 'The backup job finished processing all records.',
  },
};

export const AtRisk: Story = {
  render: (args) => {
    stubPCore(() => Promise.resolve({ data: { data: [{ Value: 42, Max: 100 }] } }));
    return renderProgressBar(args);
  },
  args: {
    ...configProps,
    label: 'Sync job progress',
    tone: 'warning',
    size: 'large',
    helperText: 'Updates have slowed; the sync job may be stalled.',
  },
};

export const Loading: Story = {
  render: (args) => {
    /* Never resolves, so the widget stays indeterminate until the messaging service delivers the first update */
    stubPCore(() => new Promise(() => {}));
    return renderProgressBar(args);
  },
  args: {
    ...configProps,
    label: 'Import job progress',
    helperText: 'Waiting for the import job to report its first update.',
  },
};
