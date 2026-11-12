import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';
import { readCriteriaList } from './criteria';
import { propertyToToast, toToast } from './toast';

const { Default } = composeStories(DemoStories);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Default story', () => {
  test('shows a toast when a message matches the case criterion', async () => {
    render(<Default />);

    fireEvent.click(screen.getByText('Send message'));

    expect(await screen.findByText('Sample message')).toBeVisible();
  });

  test('shows the content from the configured message field', async () => {
    render(<Default contentField='text' content='Message sent through text' />);

    fireEvent.click(screen.getByText('Send message'));

    expect(await screen.findByText('Message sent through text')).toBeVisible();
  });

  test('shows the value of the configured property as the toast text', async () => {
    render(<Default messageSource='property' />);

    fireEvent.click(screen.getByText('Send message'));

    expect(await screen.findByText('Text read from the case property')).toBeVisible();
  });

  test('shows no toast while the configured property is empty', () => {
    render(<Default messageSource='property' messageProperty='.Missing' />);

    fireEvent.click(screen.getByText('Send message'));

    expect(screen.queryByText('Text read from the case property')).not.toBeInTheDocument();
  });

  test('does not subscribe without a matcher', () => {
    render(<Default matcher=' ' />);

    fireEvent.click(screen.getByText('Send message'));

    expect(screen.queryByText('Sample message')).not.toBeInTheDocument();
  });

  test('unsubscribes from each active criterion when removed', () => {
    const { unmount } = render(
      <Default criteriaCount='2' criterion2Type='property' criterion2Name='Status' criterion2Property='.Status' />,
    );
    const unsubscribe = jest.spyOn(PCore.getMessagingServiceManager(), 'unsubscribe');

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });

  test('requests a refresh of the view instead of showing a toast', () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Default action='refresh' />);

    fireEvent.click(screen.getByText('Send message'));

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('refresh view requested'),
      expect.objectContaining({ contextName: 'app/primary_1' }),
    );
    expect(screen.queryByText('Sample message')).not.toBeInTheDocument();
  });
});

describe('readCriteriaList', () => {
  const pConn = {
    getContextName: () => 'app/primary_1',
    getPageReference: () => 'caseInfo.content',
    getValue: () => 'CASE-1',
  } as unknown as typeof PConnect;

  beforeEach(() => {
    window.PCore = {
      getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'caseInfo.ID' } }),
      getEnvironmentInfo: () => ({ getOperatorIdentifier: () => 'Ada@Pega' }),
      getStoreValue: (property: string) => (property === '.Region' ? 'EMEA' : ''),
    } as unknown as typeof PCore;
  });

  test('builds the case, operator and property criteria', () => {
    expect(
      readCriteriaList(pConn, '3', {
        criterion1Type: 'case',
        criterion2Type: 'operator',
        criterion3Type: 'property',
        criterion3Name: 'Region',
        criterion3Property: '.Region',
      }),
    ).toEqual([{ ID: 'CASE-1' }, { userId: 'ada@pega' }, { Region: 'EMEA' }]);
  });

  test('uses only the selected number of criteria and removes duplicates', () => {
    expect(
      readCriteriaList(pConn, '2', { criterion1Type: 'case', criterion2Type: 'case', criterion3Type: 'operator' }),
    ).toEqual([{ ID: 'CASE-1' }]);
  });

  test('skips a property criterion without a name or with an empty value', () => {
    expect(readCriteriaList(pConn, '1', { criterion1Type: 'property', criterion1Property: '.Region' })).toEqual([]);
    expect(
      readCriteriaList(pConn, '1', {
        criterion1Type: 'property',
        criterion1Name: 'Region',
        criterion1Property: '.Other',
      }),
    ).toEqual([]);
  });
});

describe('toToast', () => {
  test('uses the configured field as the text', () => {
    expect(toToast({ message: { body: 'Hi' } }, 'body')).toEqual({ content: 'Hi' });
  });

  test('uses a plain string message as the text', () => {
    expect(toToast({ message: 'Hi' }, 'content')?.content).toBe('Hi');
  });

  test('ignores empty messages', () => {
    expect(toToast({ message: { content: ' ' } }, 'content')).toBeUndefined();
    expect(toToast(null, 'content')).toBeUndefined();
  });
});

describe('propertyToToast', () => {
  const pConn = {
    getContextName: () => 'app/primary_1',
    getPageReference: () => 'caseInfo.content',
  } as unknown as typeof PConnect;

  beforeEach(() => {
    window.PCore = {
      getStoreValue: (property: string) => (property === '.Notification' ? 'Hello' : undefined),
    } as unknown as typeof PCore;
  });

  test('uses the property value as the text', () => {
    expect(propertyToToast(pConn, '.Notification')).toEqual({ content: 'Hello' });
  });

  test('ignores a missing property or an empty value', () => {
    expect(propertyToToast(pConn, '')).toBeUndefined();
    expect(propertyToToast(pConn, '.Other')).toBeUndefined();
  });
});
