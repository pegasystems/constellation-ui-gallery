import { fireEvent, render, screen } from '@testing-library/react';
import { PegaExtensionsDateInput, formatDisplayValue, normalizeDateValue, resolveLocale } from './index';

const mockUpdateFieldValue = jest.fn();
const mockTriggerFieldChange = jest.fn();

let lastConfigurationProps: any;
let lastDateInputProps: any;

jest.mock('@pega/cosmos-react-core', () => {
  const actual = jest.requireActual('@pega/cosmos-react-core');
  const React = jest.requireActual('react');

  return {
    ...actual,
    withConfiguration: (Component: any) => Component,
    Configuration: ({ children, ...props }: any) => {
      lastConfigurationProps = props;
      return <div data-testid='configuration'>{children}</div>;
    },
    DateInput: (props: any) => {
      lastDateInputProps = props;
      return (
        <button
          data-testid='date-input'
          onClick={() =>
            props.onChange?.({
              valueAsISOString: '2026-03-26T00:00:00.000Z',
              valueAsTimestamp: Date.UTC(2026, 2, 26),
            })
          }
          onBlur={() =>
            props.onBlur?.({
              valueAsISOString: '2026-03-26T00:00:00.000Z',
              valueAsTimestamp: Date.UTC(2026, 2, 26),
            })
          }
        >
          {props.label}
        </button>
      );
    },
    Text: ({ children }: any) => <span>{children}</span>,
  };
});

const buildPConnect = () => {
  return {
    getStateProps: () => {
      return {
        value: '.DateInputSample',
      };
    },
    getActionsApi: () => {
      return {
        updateFieldValue: mockUpdateFieldValue,
        triggerFieldChange: mockTriggerFieldChange,
      };
    },
    ignoreSuggestion: jest.fn(),
  };
};

beforeEach(() => {
  mockUpdateFieldValue.mockReset();
  mockTriggerFieldChange.mockReset();
  lastConfigurationProps = undefined;
  lastDateInputProps = undefined;
});

test('normalizes DateInput callback values to a plain date string', () => {
  expect(normalizeDateValue('2026-03-26T00:00:00.000Z')).toBe('2026-03-26');
  expect(normalizeDateValue(undefined)).toBe('');
});

test('prefers locale override and falls back to environment locale', () => {
  expect(resolveLocale('ja-JP-u-ca-japanese', undefined)).toBe('ja-JP-u-ca-japanese');
  expect(resolveLocale(undefined, { getLocale: () => 'en-GB' })).toBe('en-GB');
});

test('wraps Cosmos DateInput in Configuration when a locale override is provided', () => {
  render(
    <PegaExtensionsDateInput
      label='Date of birth'
      value='2026-03-26'
      localeOverride='ja-JP-u-ca-japanese'
      getPConnect={buildPConnect}
    />,
  );

  expect(screen.getByTestId('configuration')).toBeInTheDocument();
  expect(lastConfigurationProps.locale).toBe('ja-JP-u-ca-japanese');
  expect(lastDateInputProps.label).toBe('Date of birth');
});

test('updates and commits a normalized date value', () => {
  render(<PegaExtensionsDateInput label='Date of birth' value='2026-03-01' getPConnect={buildPConnect} />);

  const input = screen.getByTestId('date-input');
  fireEvent.click(input);
  fireEvent.blur(input);

  expect(mockUpdateFieldValue).toHaveBeenCalledWith('.DateInputSample', '2026-03-26');
  expect(mockTriggerFieldChange).toHaveBeenCalledWith('.DateInputSample', '2026-03-26');
});

test('renders a localized display-only value', () => {
  const locale = 'ja-JP-u-ca-japanese';

  render(
    <PegaExtensionsDateInput
      label='Date of birth'
      value='2026-03-26'
      displayMode='DISPLAY_ONLY'
      localeOverride={locale}
      getPConnect={buildPConnect}
    />,
  );

  expect(screen.getByText(formatDisplayValue('2026-03-26', locale))).toBeVisible();
});
