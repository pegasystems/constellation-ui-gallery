import { act, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react-webpack5';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';
import { PegaExtensionsProgressBar } from './index';

const { Default, Complete, AtRisk, Continuous, PollingInterval } = composeStories(DemoStories);

test('loads its first value from the data page and renders accessible values', async () => {
  render(<Default />);

  const progress = await screen.findByRole('progressbar', { name: 'Export job progress' });
  expect(progress).toHaveAttribute('aria-valuenow', '12');
  expect(progress).toHaveAttribute('aria-valuemax', '100');
  expect(screen.getByText('12%')).toBeVisible();
  expect(screen.getByText('On track')).toBeVisible();
  expect(screen.getByText('12 of 100 completed')).toBeVisible();
});

test('refreshes the data page after a socket message reaches the messaging service', async () => {
  jest.useFakeTimers();
  try {
    render(<Default />);

    const progress = await screen.findByRole('progressbar', { name: 'Export job progress' });
    expect(await screen.findByText('12%')).toBeVisible();
    expect(progress).toHaveAttribute('aria-valuenow', '12');

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(progress).toHaveAttribute('aria-valuenow', '27');
    expect(screen.getByText('27%')).toBeVisible();
  } finally {
    jest.useRealTimers();
  }
});

test('can hide the completed fraction', async () => {
  render(<Default showFraction={false} />);

  await screen.findByRole('progressbar', { name: 'Export job progress' });
  expect(await screen.findByText('12%')).toBeVisible();
  expect(screen.queryByText('12 of 100 completed')).not.toBeInTheDocument();
});

test('renders completion state', async () => {
  render(<Complete />);

  const progress = await screen.findByRole('progressbar', { name: 'Backup job progress' });
  expect(progress).toHaveAttribute('aria-valuenow', '100');
  expect(progress).toHaveAttribute('aria-valuetext', '100% complete');
  expect(screen.getByText('100 of 100 completed')).toBeVisible();
});

test('renders an at-risk state', async () => {
  render(<AtRisk />);

  const progress = await screen.findByRole('progressbar', { name: 'Sync job progress' });
  expect(progress).toHaveAttribute('aria-valuemin', '20');
  expect(progress).toHaveAttribute('aria-valuemax', '100');
  expect(progress).toHaveAttribute('aria-valuenow', '42');
  expect(screen.getByText('22 of 80 completed')).toBeVisible();
  expect(screen.getByText('At risk')).toBeVisible();
});

test('stays indeterminate until the data page resolves', () => {
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({ getData: () => new Promise(() => {}) }),
    getMessagingServiceManager: () => ({
      subscribe: () => 'subscription-id',
      unsubscribe: () => {},
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => 'WORK-1',
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  render(
    <PegaExtensionsProgressBar label='Import job progress' dataPage='D_ImportJobProgress' getPConnect={getPConnect} />,
  );

  const progress = screen.getByRole('progressbar', { name: 'Import job progress' });
  expect(progress).not.toHaveAttribute('aria-valuenow');
  expect(progress).toHaveAttribute('aria-valuetext', 'In progress');
  expect(screen.queryByText(/completed/)).not.toBeInTheDocument();
});

test('runs continuously with no data page or PCore involved', () => {
  delete (window as { PCore?: typeof PCore }).PCore;

  render(<Continuous />);

  const progress = screen.getByRole('progressbar', { name: 'Indexing job' });
  expect(progress).not.toHaveAttribute('aria-valuenow');
  expect(progress).toHaveAttribute('aria-valuetext', 'In progress');
});

test('offsets progress from a non-zero minimum reported by the data page', async () => {
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: 50, Min: 20, Max: 100 }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe: () => 'subscription-id',
      unsubscribe: () => {},
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => 'WORK-1',
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  render(<PegaExtensionsProgressBar label='Gauge progress' dataPage='D_GaugeProgress' getPConnect={getPConnect} />);

  const progress = await screen.findByRole('progressbar', { name: 'Gauge progress' });
  expect(progress).toHaveAttribute('aria-valuemin', '20');
  expect(progress).toHaveAttribute('aria-valuemax', '100');
  expect(progress).toHaveAttribute('aria-valuenow', '50');
  expect(await screen.findByText('38%')).toBeVisible();
});

test('lets the data page override the static tone', async () => {
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: 30, Max: 100, Tone: 'danger' }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe: () => 'subscription-id',
      unsubscribe: () => {},
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => 'WORK-1',
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  render(
    <PegaExtensionsProgressBar label='Failing job' tone='accent' dataPage='D_FailingJob' getPConnect={getPConnect} />,
  );

  expect(await screen.findByText('Needs attention')).toBeVisible();
});

test('ignores an invalid tone reported by the data page', async () => {
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: 30, Max: 100, Tone: 'not-a-tone' }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe: () => 'subscription-id',
      unsubscribe: () => {},
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => 'WORK-1',
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  render(
    <PegaExtensionsProgressBar label='Steady job' tone='accent' dataPage='D_SteadyJob' getPConnect={getPConnect} />,
  );

  expect(await screen.findByText('On track')).toBeVisible();
});

test('falls back to the static tone when the tone property no longer resolves', async () => {
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: 30, Max: 100, Tone: 'danger' }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe: () => 'subscription-id',
      unsubscribe: () => {},
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => 'WORK-1',
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  const { rerender } = render(
    <PegaExtensionsProgressBar label='Job' tone='accent' dataPage='D_Job' getPConnect={getPConnect} />,
  );
  expect(await screen.findByText('Needs attention')).toBeVisible();

  rerender(
    <PegaExtensionsProgressBar
      label='Job'
      tone='accent'
      toneProperty='MissingField'
      dataPage='D_Job'
      getPConnect={getPConnect}
    />,
  );
  expect(await screen.findByText('On track')).toBeVisible();
});

test('subscribes to and unsubscribes from the PCore messaging service', () => {
  const subscribe = jest.fn(() => 'subscription-id');
  const unsubscribe = jest.fn();
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: 10, Max: 100 }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe,
      unsubscribe,
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => 'WORK-1',
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  const { unmount } = render(
    <PegaExtensionsProgressBar label='Live export progress' dataPage='D_ExportJobProgress' getPConnect={getPConnect} />,
  );

  expect(subscribe).toHaveBeenCalledWith(
    { matcher: 'CASE', criteria: { caseId: 'WORK-1' } },
    expect.any(Function),
    'primary',
  );

  unmount();

  expect(unsubscribe).toHaveBeenCalledWith('subscription-id');
});

test('falls back to polling when the messaging service is unavailable', () => {
  jest.useFakeTimers();
  try {
    const getData = jest.fn(() => Promise.resolve({ data: { data: [{ Value: 10, Max: 100 }] } }));
    window.PCore = {
      getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
      getDataApiUtils: () => ({ getData }),
      getMessagingServiceManager: () => {
        throw new Error('Messaging service not initialized');
      },
    } as unknown as typeof PCore;

    const getPConnect = () =>
      ({
        getValue: () => 'WORK-1',
        getLocalizedValue: (text: string) => text,
        getContextName: () => 'primary',
      }) as unknown as typeof PConnect;

    const { unmount } = render(
      <PegaExtensionsProgressBar label='Export progress' dataPage='D_ExportJobProgress' getPConnect={getPConnect} />,
    );

    expect(getData).toHaveBeenCalledTimes(1);
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(getData).toHaveBeenCalledTimes(2);

    unmount();
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(getData).toHaveBeenCalledTimes(2);
  } finally {
    jest.useRealTimers();
  }
});

test('loads once and never subscribes when the update strategy is onLoad', async () => {
  jest.useFakeTimers();
  try {
    const subscribe = jest.fn(() => 'subscription-id');
    const getData = jest.fn(() => Promise.resolve({ data: { data: [{ Value: 35, Max: 100 }] } }));
    window.PCore = {
      getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
      getDataApiUtils: () => ({ getData }),
      getMessagingServiceManager: () => ({ subscribe, unsubscribe: () => {} }),
    } as unknown as typeof PCore;

    const getPConnect = () =>
      ({
        getValue: () => 'WORK-1',
        getLocalizedValue: (text: string) => text,
        getContextName: () => 'primary',
      }) as unknown as typeof PConnect;

    render(
      <PegaExtensionsProgressBar
        label='Report progress'
        dataPage='D_ReportProgress'
        updateStrategy='onLoad'
        getPConnect={getPConnect}
      />,
    );

    expect(await screen.findByText('35%')).toBeVisible();
    await act(async () => {
      jest.advanceTimersByTime(60000);
    });

    expect(getData).toHaveBeenCalledTimes(1);
    expect(subscribe).not.toHaveBeenCalled();
  } finally {
    jest.useRealTimers();
  }
});

test('polls the data page on the configured interval and stops when unmounted', async () => {
  jest.useFakeTimers();
  try {
    const subscribe = jest.fn(() => 'subscription-id');
    const getData = jest.fn(() => Promise.resolve({ data: { data: [{ Value: 10, Max: 100 }] } }));
    window.PCore = {
      getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
      getDataApiUtils: () => ({ getData }),
      getMessagingServiceManager: () => ({ subscribe, unsubscribe: () => {} }),
    } as unknown as typeof PCore;

    const getPConnect = () =>
      ({
        getValue: () => 'WORK-1',
        getLocalizedValue: (text: string) => text,
        getContextName: () => 'primary',
      }) as unknown as typeof PConnect;

    const { unmount } = render(
      <PegaExtensionsProgressBar
        label='Polled progress'
        dataPage='D_PolledProgress'
        updateStrategy='interval'
        refreshIntervalSeconds={10}
        getPConnect={getPConnect}
      />,
    );

    expect(getData).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(20000);
    });
    expect(getData).toHaveBeenCalledTimes(3);

    unmount();
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });
    expect(getData).toHaveBeenCalledTimes(3);
    expect(subscribe).not.toHaveBeenCalled();
  } finally {
    jest.useRealTimers();
  }
});

test('shows each value a polling interval delivers', async () => {
  jest.useFakeTimers();
  try {
    render(<PollingInterval />);

    const progress = await screen.findByRole('progressbar', { name: 'Polled export progress' });
    expect(await screen.findByText('12%')).toBeVisible();
    expect(progress).toHaveAttribute('aria-valuenow', '12');

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });
    expect(progress).toHaveAttribute('aria-valuenow', '27');
  } finally {
    jest.useRealTimers();
  }
});

test('subscribes to data page updates when used on a page without a case context', () => {
  const subscribe = jest.fn(() => 'subscription-id');
  const unsubscribe = jest.fn();
  window.PCore = {
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfoID' } }),
    getDataApiUtils: () => ({
      getData: () => Promise.resolve({ data: { data: [{ Value: 10, Max: 100 }] } }),
    }),
    getMessagingServiceManager: () => ({
      subscribe,
      unsubscribe,
    }),
  } as unknown as typeof PCore;

  const getPConnect = () =>
    ({
      getValue: () => undefined,
      getLocalizedValue: (text: string) => text,
      getContextName: () => 'primary',
    }) as unknown as typeof PConnect;

  render(
    <PegaExtensionsProgressBar label='Live export progress' dataPage='D_ExportJobProgress' getPConnect={getPConnect} />,
  );

  expect(subscribe).toHaveBeenCalledWith(
    { matcher: 'DATAPAGE_UPDATED', criteria: { datapage: 'D_ExportJobProgress' } },
    expect.any(Function),
    'primary',
  );
});
