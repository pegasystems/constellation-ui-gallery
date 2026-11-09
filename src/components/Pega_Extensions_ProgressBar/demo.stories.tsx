import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { configProps, createProgressDataPageResponse, rapidProgressSteps } from './mock';
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

type ProgressFilter = {
  matcher: string;
  criteria: Record<string, string>;
};

type ProgressSubscription = {
  filter: ProgressFilter;
  handler: () => void;
};

/* Simulates a backend socket updating the data page before notifying the messaging service. */
const stubPCoreWithRapidUpdates = (steps: number[], args: StoryArgs, intervalMs = 1000) => {
  let step = 0;
  let nextSubscriptionId = 0;
  let socketIntervalId: number | undefined;
  const subscriptions = new Map<string, ProgressSubscription>();

  const routeSocketMessage = () => {
    const socketMessage = {
      filter: {
        matcher: 'CASE',
        criteria: { caseId: 'WORK-1' },
      },
      message: {
        datapage: 'D_ExportJobProgress',
      },
    };

    subscriptions.forEach(({ filter, handler }) => {
      if (
        filter.matcher === socketMessage.filter.matcher &&
        filter.criteria.caseId === socketMessage.filter.criteria.caseId
      ) {
        handler();
      }
    });
  };

  const startSocket = () => {
    socketIntervalId = window.setInterval(() => {
      if (step < steps.length - 1) step += 1;
      routeSocketMessage();
    }, intervalMs);
  };

  const stopSocket = () => {
    if (socketIntervalId !== undefined) {
      window.clearInterval(socketIntervalId);
      socketIntervalId = undefined;
    }
  };

  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve(createProgressDataPageResponse(args, steps[step], 0, 100)),
    }),
    getMessagingServiceManager: () => ({
      subscribe: (filter: ProgressFilter, handler: () => void) => {
        const subscriptionId = `subscription-${nextSubscriptionId++}`;
        subscriptions.set(subscriptionId, { filter, handler });
        if (subscriptions.size === 1) startSocket();
        return subscriptionId;
      },
      unsubscribe: (subscriptionId: string) => {
        subscriptions.delete(subscriptionId);
        if (subscriptions.size === 0) stopSocket();
      },
    }),
  } as unknown as typeof PCore;
};

/* Serves the next value on every fetch, as a data page polled on a timer would */
const stubPCoreWithPolling = (steps: number[], args: StoryArgs) => {
  let step = 0;
  stubPCore(() => {
    const value = steps[Math.min(step, steps.length - 1)];
    step += 1;
    return Promise.resolve(createProgressDataPageResponse(args, value, 0, 100));
  });
};

const StoryComponent = (args: StoryArgs) => {
  stubPCoreWithRapidUpdates(rapidProgressSteps, args);
  return renderProgressBar(args);
};

const meta = {
  title: 'Widgets/Progress Bar',
  component: StoryComponent,
  args: {
    indeterminateOnly: false,
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    indeterminateOnly: {
      control: {
        type: 'boolean',
      },
    },
    dataPage: {
      control: {
        type: 'text',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    updateStrategy: {
      options: ['messaging', 'interval', 'onLoad'],
      labels: {
        messaging: 'Push (PCore messaging service)',
        interval: 'Poll on an interval',
        onLoad: 'Load once on page load',
      },
      control: {
        type: 'select',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    refreshIntervalSeconds: {
      control: {
        type: 'number',
        min: 10,
      },
      if: {
        arg: 'updateStrategy',
        eq: 'interval',
      },
    },
    valueProperty: {
      control: {
        type: 'text',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    minProperty: {
      control: {
        type: 'text',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    maxProperty: {
      control: {
        type: 'text',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    toneProperty: {
      control: {
        type: 'text',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    testId: {
      control: {
        type: 'text',
      },
    },
    tone: {
      options: ['accent', 'success', 'warning', 'danger'],
      labels: {
        accent: 'Accent',
        success: 'Success',
        warning: 'Warning',
        danger: 'Danger',
      },
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['compact', 'regular', 'large'],
      labels: {
        compact: 'Compact',
        regular: 'Regular',
        large: 'Large',
      },
      control: {
        type: 'inline-radio',
      },
    },
    showValue: {
      control: {
        type: 'boolean',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
    showFraction: {
      control: {
        type: 'boolean',
      },
      if: {
        arg: 'indeterminateOnly',
        eq: false,
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    stubPCoreWithRapidUpdates(rapidProgressSteps, args);
    return renderProgressBar(args);
  },
  args: configProps,
};

export const PollingInterval: Story = {
  render: (args) => {
    stubPCoreWithPolling(rapidProgressSteps, args);
    return renderProgressBar(args);
  },
  args: {
    ...configProps,
    label: 'Polled export progress',
    updateStrategy: 'interval',
    refreshIntervalSeconds: 10,
    helperText: 'The data page is fetched every few seconds, whether or not anything changed.',
  },
};

export const LoadOnce: Story = {
  render: (args) => {
    stubPCore(() => Promise.resolve(createProgressDataPageResponse(args, 64, 0, 100)));
    return renderProgressBar(args);
  },
  args: {
    ...configProps,
    label: 'Report progress',
    updateStrategy: 'onLoad',
    helperText: 'Fetched once when the page opens; reload the page to see newer progress.',
  },
};

export const Complete: Story = {
  render: (args) => {
    stubPCore(() => Promise.resolve(createProgressDataPageResponse(args, 100, 0, 100)));
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
    stubPCore(() => Promise.resolve(createProgressDataPageResponse(args, 42, 20, 100, 'warning')));
    return renderProgressBar(args);
  },
  args: {
    ...configProps,
    label: 'Sync job progress',
    valueProperty: 'Completed',
    minProperty: 'Start',
    maxProperty: 'Total',
    toneProperty: 'Status',
    tone: 'accent',
    size: 'large',
    helperText: 'Updates have slowed; the sync job may be stalled.',
  },
};

export const Continuous: Story = {
  /* indeterminateOnly mode never fetches or subscribes */
  render: (args) => renderProgressBar(args),
  args: {
    ...configProps,
    label: 'Indexing job',
    indeterminateOnly: true,
    dataPage: undefined,
    helperText: 'Runs continuously while the indexing job is in progress.',
  },
};
