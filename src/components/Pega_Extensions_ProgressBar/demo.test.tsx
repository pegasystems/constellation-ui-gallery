import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react-webpack5';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';
import { PegaExtensionsProgressBar } from './index';

const { Default, Complete, AtRisk, Loading } = composeStories(DemoStories);

test('loads its first value from the data page and renders accessible values', async () => {
  render(<Default />);

  const progress = await screen.findByRole('progressbar', { name: 'Export job progress' });
  expect(progress).toHaveAttribute('aria-valuenow', '12');
  expect(progress).toHaveAttribute('aria-valuemax', '100');
  expect(screen.getByText('12%')).toBeVisible();
  expect(screen.getByText('On track')).toBeVisible();
  expect(screen.getByTestId('ProgressBar-12345678:marker:50')).toBeInTheDocument();
});

test('renders completion state', async () => {
  render(<Complete />);

  const progress = await screen.findByRole('progressbar', { name: 'Backup job progress' });
  expect(progress).toHaveAttribute('aria-valuenow', '100');
  expect(progress).toHaveAttribute('aria-valuetext', '100% complete');
  expect(screen.getAllByText('Complete').length).toBeGreaterThan(0);
});

test('renders an at-risk state', async () => {
  render(<AtRisk />);

  const progress = await screen.findByRole('progressbar', { name: 'Sync job progress' });
  expect(progress).toHaveAttribute('aria-valuenow', '42');
  expect(screen.getByText('In review')).toBeVisible();
});

test('stays indeterminate until the data page resolves', () => {
  render(<Loading />);

  const progress = screen.getByRole('progressbar', { name: 'Import job progress' });
  expect(progress).not.toHaveAttribute('aria-valuenow');
  expect(progress).toHaveAttribute('aria-valuetext', 'In progress');
  expect(screen.queryByText('Working')).not.toBeInTheDocument();
  expect(screen.queryByTestId('ProgressBar-12345678:marker:50')).not.toBeInTheDocument();
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

  render(
    <PegaExtensionsProgressBar label='Gauge progress' dataPage='D_GaugeProgress' getPConnect={getPConnect} />,
  );

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
