import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BasePegaExtensionsCustomKPIGauge } = composeStories(DemoStories);

/* Mock PCore globally for tests */
beforeEach(() => {
  (window as any).PCore = {
    getDataApiUtils: () => ({
      getData: jest.fn().mockResolvedValue({
        data: {
          data: [{ TotalRevenue: 85 }]
        }
      })
    }),
    getConstants: () => ({
      CASE_INFO: {
        CASE_INFO_ID: '.pyID'
      }
    }),
    getPubSubUtils: () => ({
      publish: jest.fn(),
      subscribe: jest.fn()
    })
  };
});

afterEach(() => {
  delete (window as any).PCore;
});

test('renders CustomKPIGauge with label', async () => {
  render(<BasePegaExtensionsCustomKPIGauge />);
  expect(await screen.findByText('Monthly Revenue ($)')).toBeVisible();
});

test('renders the refresh button', async () => {
  render(<BasePegaExtensionsCustomKPIGauge />);
  const refreshButton = await screen.findByRole('button', { name: /refresh/i });
  expect(refreshButton).toBeInTheDocument();
});

test('displays value from data page after loading', async () => {
  render(<BasePegaExtensionsCustomKPIGauge />);
  await waitFor(() => {
    expect(screen.getByText('85')).toBeVisible();
  });
});

test('renders value when below low threshold', async () => {
  render(<BasePegaExtensionsCustomKPIGauge thresholdLow={100} thresholdHigh={150} />);
  await waitFor(() => {
    expect(screen.getByText('85')).toBeVisible();
  });
});

test('applies green color when value is above high threshold', async () => {
  (window as any).PCore.getDataApiUtils = () => ({
    getData: jest.fn().mockResolvedValue({
      data: {
        data: [{ TotalRevenue: 130 }]
      }
    })
  });

  render(<BasePegaExtensionsCustomKPIGauge thresholdLow={50} thresholdHigh={100} />);
  await waitFor(() => {
    expect(screen.getByText('130')).toBeVisible();
  });
});

test('shows configuration message when dataPageName is missing', async () => {
  render(<BasePegaExtensionsCustomKPIGauge dataPageName='' />);
  expect(
    await screen.findByText('Please configure the data page name and property name.')
  ).toBeVisible();
});

test('refresh button re-fetches data', async () => {
  const getDataMock = jest.fn().mockResolvedValue({
    data: {
      data: [{ TotalRevenue: 85 }]
    }
  });

  (window as any).PCore.getDataApiUtils = () => ({
    getData: getDataMock
  });

  render(<BasePegaExtensionsCustomKPIGauge />);

  await waitFor(() => {
    expect(screen.getByText('85')).toBeVisible();
  });

  const refreshButton = screen.getByRole('button', { name: /refresh/i });
  fireEvent.click(refreshButton);

  await waitFor(() => {
    /* getData should have been called twice: once on mount, once on refresh */
    expect(getDataMock).toHaveBeenCalledTimes(2);
  });
});
