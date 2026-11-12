import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, Flex, Text } from '@pega/cosmos-react-core';
import { PegaExtensionsEventListener } from './index';

type Handler = (payload: unknown) => void;
type Filter = { matcher: string; criteria: Record<string, string> };
type CriterionSetting = `criterion${number}${'Type' | 'Name' | 'Property'}`;
type EventListenerComponentProps = Parameters<typeof PegaExtensionsEventListener>[0];
type EventListenerStoryArgs = {
  action?: EventListenerComponentProps['action'];
  messageSource?: EventListenerComponentProps['messageSource'];
  content: string;
  messageProperty?: EventListenerComponentProps['messageProperty'];
  matcher?: EventListenerComponentProps['matcher'];
  criteriaCount?: EventListenerComponentProps['criteriaCount'];
  criterion1Type?: EventListenerComponentProps[CriterionSetting];
  criterion1Name?: EventListenerComponentProps[CriterionSetting];
  criterion1Property?: EventListenerComponentProps[CriterionSetting];
  criterion2Type?: EventListenerComponentProps[CriterionSetting];
  criterion2Name?: EventListenerComponentProps[CriterionSetting];
  criterion2Property?: EventListenerComponentProps[CriterionSetting];
  criterion3Type?: EventListenerComponentProps[CriterionSetting];
  criterion3Name?: EventListenerComponentProps[CriterionSetting];
  criterion3Property?: EventListenerComponentProps[CriterionSetting];
  criterion4Type?: EventListenerComponentProps[CriterionSetting];
  criterion4Name?: EventListenerComponentProps[CriterionSetting];
  criterion4Property?: EventListenerComponentProps[CriterionSetting];
  criterion5Type?: EventListenerComponentProps[CriterionSetting];
  criterion5Name?: EventListenerComponentProps[CriterionSetting];
  criterion5Property?: EventListenerComponentProps[CriterionSetting];
  contentField?: EventListenerComponentProps['contentField'];
  getPConnect: EventListenerComponentProps['getPConnect'];
};

const CASE_ID = 'ON6E5R-DIYRECIPE-WORK R-1';
const OPERATOR_ID = 'Ada@Pega';
const PAGE_REFERENCE = 'caseInfo.content';
const CONTEXT_NAME = 'app/primary_1';
const VIEW_NAME = 'WorkDetails';
const CRITERION_TYPES = ['case', 'operator', 'property'];
const CRITERION_LABELS = { case: 'Current case', operator: 'Current operator', property: 'Property' };

/** In-memory messaging service: delivers a message to the subscribers with the same matcher and criteria. */
const subscriptions = new Map<string, { filter: Filter; handler: Handler }>();
let nextSubscriptionId = 0;

const messagingManager = {
  subscribe: (filter: Filter, handler: Handler) => {
    nextSubscriptionId += 1;
    const id = `sub-${nextSubscriptionId}`;
    subscriptions.set(id, { filter, handler });
    return id;
  },
  unsubscribe: (id: string) => {
    subscriptions.delete(id);
  },
};

const publishMessage = (matcher: string, criteria: Record<string, string>, message: Record<string, string>) => {
  subscriptions.forEach(({ filter, handler }) => {
    if (filter.matcher === matcher && JSON.stringify(filter.criteria) === JSON.stringify(criteria)) {
      handler({ filter: { matcher, criteria }, message });
    }
  });
};

const setPCore = () => {
  window.PCore = {
    getConstants: () => ({
      CASE_INFO: { CASE_INFO_ID: 'caseInfo.ID' },
    }),
    getEnvironmentInfo: () => ({
      getOperatorIdentifier: () => OPERATOR_ID,
    }),
    getStoreValue: (property: string, pageReference: string) => {
      if (pageReference !== PAGE_REFERENCE) return undefined;
      return (
        {
          '.Status': 'Open',
          '.Priority': 'High',
          '.Notification': 'Text read from the case property',
        }[property] ?? undefined
      );
    },
    getMessagingServiceManager: () => messagingManager,
  } as unknown as typeof PCore;
};

const getPConnect = () => {
  return {
    getContextName: () => CONTEXT_NAME,
    getPageReference: () => PAGE_REFERENCE,
    getValue: () => CASE_ID,
    getCaseInfo: () => ({ getKey: () => CASE_ID }),
    getCurrentView: () => VIEW_NAME,
    getActionsApi: () => ({
      refreshCaseView: (caseKey: string, viewName: string) => {
        console.log('refresh view requested', { contextName: CONTEXT_NAME, caseKey, viewName });
      },
    }),
  } as unknown as typeof PConnect;
};

type Story = StoryObj<EventListenerStoryArgs>;

const EventListenerDemo = (args: EventListenerStoryArgs) => {
  setPCore();
  const { content, ...componentArgs } = args;
  const matcher = componentArgs.matcher ?? '';
  const contentField = componentArgs.contentField || 'content';
  const message = { [contentField]: content };
  const fromProperty = componentArgs.messageSource === 'property';

  return (
    <Flex container={{ direction: 'column', gap: 1 }}>
      <PegaExtensionsEventListener {...componentArgs} getPConnect={getPConnect} />
      <Text variant='secondary'>
        {componentArgs.action === 'refresh'
          ? 'The widget renders nothing. The tab is refreshed when a matching message is received.'
          : fromProperty
            ? `The widget renders nothing. A toast displays the value of the ${componentArgs.messageProperty} property when a matching message is received.`
            : `The widget renders nothing. A toast displays the message's ${contentField} field when a matching message is received.`}
      </Text>
      <Flex container={{ gap: 1 }}>
        <Button onClick={() => publishMessage(matcher, { ID: CASE_ID }, message)}>Send message</Button>
      </Flex>
    </Flex>
  );
};

export default {
  title: 'Widgets/Event Listener',
  component: EventListenerDemo,
  argTypes: {
    action: {
      control: { type: 'select', labels: { toast: 'Display toast', refresh: 'Refresh view' } },
      options: ['toast', 'refresh'],
    },
    messageSource: {
      control: { type: 'select', labels: { message: 'Field of the received message', property: 'Property' } },
      options: ['message', 'property'],
      if: { arg: 'action', eq: 'toast' },
    },
    content: {
      control: 'text',
      description: 'Content sent in the demo message and shown in the toast.',
      if: { arg: 'messageSource', neq: 'property' },
    },
    messageProperty: {
      control: 'text',
      description: 'Property whose value is shown in the toast.',
      if: { arg: 'messageSource', eq: 'property' },
    },
    matcher: { control: 'text' },
    criteriaCount: { control: 'select', options: ['1', '2', '3', '4', '5'] },
    criterion1Type: { control: { type: 'select', labels: CRITERION_LABELS }, options: CRITERION_TYPES },
    criterion1Name: { control: 'text', if: { arg: 'criterion1Type', eq: 'property' } },
    criterion1Property: { control: 'text', if: { arg: 'criterion1Type', eq: 'property' } },
    criterion2Type: { control: { type: 'select', labels: CRITERION_LABELS }, options: CRITERION_TYPES },
    criterion2Name: { control: 'text', if: { arg: 'criterion2Type', eq: 'property' } },
    criterion2Property: { control: 'text', if: { arg: 'criterion2Type', eq: 'property' } },
    criterion3Type: { control: { type: 'select', labels: CRITERION_LABELS }, options: CRITERION_TYPES },
    criterion3Name: { control: 'text', if: { arg: 'criterion3Type', eq: 'property' } },
    criterion3Property: { control: 'text', if: { arg: 'criterion3Type', eq: 'property' } },
    criterion4Type: { control: { type: 'select', labels: CRITERION_LABELS }, options: CRITERION_TYPES },
    criterion4Name: { control: 'text', if: { arg: 'criterion4Type', eq: 'property' } },
    criterion4Property: { control: 'text', if: { arg: 'criterion4Type', eq: 'property' } },
    criterion5Type: { control: { type: 'select', labels: CRITERION_LABELS }, options: CRITERION_TYPES },
    criterion5Name: { control: 'text', if: { arg: 'criterion5Type', eq: 'property' } },
    criterion5Property: { control: 'text', if: { arg: 'criterion5Type', eq: 'property' } },
    contentField: { table: { disable: true } },
    getPConnect: { table: { disable: true } },
  },
} satisfies Meta<EventListenerStoryArgs>;

export const Default: Story = {
  render: (args) => <EventListenerDemo {...args} />,
  args: {
    action: 'toast',
    messageSource: 'message',
    content: 'Sample message',
    messageProperty: '.Notification',
    matcher: 'EVENT_LISTENER',
    criteriaCount: '1',
    criterion1Type: 'case',
    criterion1Name: '',
    criterion1Property: '',
    criterion2Type: 'property',
    criterion2Name: '',
    criterion2Property: '',
    criterion3Type: 'property',
    criterion3Name: '',
    criterion3Property: '',
    criterion4Type: 'property',
    criterion4Name: '',
    criterion4Property: '',
    criterion5Type: 'property',
    criterion5Name: '',
    criterion5Property: '',
  },
};
