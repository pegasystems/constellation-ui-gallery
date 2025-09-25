import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsNetworkDiagram, type NetworkDiagramProps } from './index';

export default {
  title: 'Widgets/Network Diagram',
  argTypes: {
    Example: {
      options: ['basic', 'example1', 'example2', 'example3', 'example4'],
      control: { type: 'radio' },
    },
    dataPage: {
      table: {
        disable: true,
      },
    },
    selectionProperty: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
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
            id: 'nested-interactive',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsNetworkDiagram,
};

const setPCore = (Example: string) => {
  let data = {};
  if (Example === 'basic') {
    data = {
      pyNodes: [
        {
          pyID: '1',
          pyLabel: 'New Wave Energy Demo Solutions',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '2',
          pyLabel: 'Info Inc',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '3',
          pyLabel: 'New Wave Asia Ltd.',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '4',
          pyLabel: 'New Wave Equity Demonstration',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '5',
          pyLabel: 'New Wave Wind',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '6',
          pyLabel: 'New Wave Hydro Information',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '7',
          pyLabel: 'New Wave Solar',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '8',
          pyLabel: 'Amce',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
      ],
      pyEdges: [
        {
          pyFrom: '1',
          pyTo: '2',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '1',
          pyTo: '3',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '2',
          pyTo: '4',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '3',
          pyTo: '4',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '4',
          pyTo: '1',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '5',
          pyTo: '6',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
      ],
    };
  } else if (Example === 'example1') {
    data = {
      pyNodes: [
        {
          pyID: '1',
          pyLabel: 'New Wave Energy Solutions',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '2',
          pyLabel: 'New Wave Americas Inc',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '3',
          pyLabel: 'New Wave Asia Ltd.',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '4',
          pyLabel: 'New Wave Equity',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '6',
          pyLabel: 'New Wave Wind',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '7',
          pyLabel: 'New Wave Hydro',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '8',
          pyLabel: 'New Wave Solar',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '9',
          pyLabel: 'European Road Tours',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '10',
          pyLabel: 'ABC Entertainment',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '11',
          pyLabel: 'New Wave Europe Ltd.',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '20',
          pyLabel: 'Talia Green',
          pyCategory: 'Individual',
        },
        {
          pyID: '21',
          pyLabel: 'Karina Dalton',
          pyCategory: 'Individual',
        },
        {
          pyID: '22',
          pyLabel: 'Sally Jones',
          pyCategory: 'Individual',
        },
        {
          pyID: '23',
          pyLabel: 'Magdalena Leanez',
          pyCategory: 'Individual',
        },
      ],
      pyEdges: [
        {
          pyFrom: '2',
          pyTo: '1',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '3',
          pyTo: '1',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '9',
          pyTo: '1',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '11',
          pyTo: '1',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '2',
          pyTo: '4',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '2',
          pyTo: '6',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '11',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '8',
          pyTo: '11',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '23',
          pyTo: '2',
          pyLabel: 'Majority shareholder',
          pyCategory: 'ownership',
        },
        {
          pyFrom: '20',
          pyTo: '1',
          pyLabel: 'Majority shareholder',
          pyCategory: 'ownership',
        },
        {
          pyFrom: '20',
          pyTo: '10',
          pyLabel: 'UBO 20%',
          pyCategory: 'ownership',
        },
        {
          pyFrom: '22',
          pyTo: '11',
          pyLabel: 'UBO 17%',
          pyCategory: 'ownership',
        },
        {
          pyFrom: '22',
          pyTo: '8',
          pyLabel: 'UBO 23%',
          pyCategory: 'ownership',
        },
        {
          pyFrom: '21',
          pyTo: '7',
          pyLabel: 'UBO 24%',
          pyCategory: 'ownership',
        },
      ],
    };
  } else if (Example === 'example2') {
    data = {
      pyNodes: [
        {
          pyID: '1',
          pyLabel: 'New Wave Energy Demo Solutions',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '2',
          pyLabel: 'Info Inc',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '3',
          pyLabel: 'New Wave Asia Ltd.',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '4',
          pyLabel: 'New Wave Equity Demonstration',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '5',
          pyLabel: 'New Wave Wind',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '6',
          pyLabel: 'New Wave Hydro Information',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '7',
          pyLabel: 'New Wave Solar',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '8',
          pyLabel: 'Amce',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
      ],
      pyEdges: [
        {
          pyFrom: '1',
          pyTo: '2',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '1',
          pyTo: '5',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '2',
          pyTo: '3',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '3',
          pyTo: '4',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '5',
          pyTo: '6',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '6',
          pyTo: '7',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '4',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
      ],
    };
  } else if (Example === 'example3') {
    data = {
      pyNodes: [
        {
          pyID: '1',
          pyLabel: 'New Wave Energy Demo Solutions',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '2',
          pyLabel: 'Info Inc',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '3',
          pyLabel: 'New Wave Asia Ltd.',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '4',
          pyLabel: 'New Wave Equity Demonstration',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '5',
          pyLabel: 'New Wave Wind',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '6',
          pyLabel: 'New Wave Hydro Information',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '7',
          pyLabel: 'New Wave Solar',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '8',
          pyLabel: 'Amce',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '9',
          pyLabel: 'Demo Test',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '10',
          pyLabel: 'Amce Uplus demo',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '11',
          pyLabel: 'Amce Corporation',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
      ],
      pyEdges: [
        {
          pyFrom: '7',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '9',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '10',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '10',
          pyTo: '11',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '1',
          pyTo: '2',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '2',
          pyTo: '3',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '2',
          pyTo: '4',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '5',
          pyTo: '6',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '5',
          pyTo: '7',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
      ],
    };
  } else if (Example === 'example4') {
    data = {
      pyNodes: [
        {
          pyID: '1',
          pyLabel: 'New Wave Energy Demo Solutions',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '2',
          pyLabel: 'Info Inc',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '3',
          pyLabel: 'New Wave Asia Ltd.',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '4',
          pyLabel: 'New Wave Equity Demonstration',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '5',
          pyLabel: 'New Wave Wind',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '6',
          pyLabel: 'New Wave Hydro Information',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '7',
          pyLabel: 'New Wave Solar',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '8',
          pyLabel: 'Amce',
          pyCategory: 'Corporation',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '9',
          pyLabel: 'John Doe',
          pyCategory: 'Ownership',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
        {
          pyID: '10',
          pyLabel: 'Jane Doe',
          pyCategory: 'Ownership',
          pzInsKey: 'XXX',
          pyClassName: 'Work-Case',
        },
      ],
      pyEdges: [
        {
          pyFrom: '1',
          pyTo: '4',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '2',
          pyTo: '5',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '3',
          pyTo: '7',
          pyLabel: 'Division',
          pyCategory: 'division',
        },
        {
          pyFrom: '4',
          pyTo: '7',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '5',
          pyTo: '7',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '6',
          pyTo: '7',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '3',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '4',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '5',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '6',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '8',
          pyTo: '9',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '8',
          pyTo: '10',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '3',
          pyTo: '9',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '3',
          pyTo: '10',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '4',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
        {
          pyFrom: '7',
          pyTo: '8',
          pyLabel: 'Subsidiary',
          pyCategory: 'subsidiary',
        },
      ],
    };
  }
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local',
      };
    },
    getEvents: () => {
      return {
        getCaseEvent: () => {
          return {
            ASSIGNMENT_SUBMISSION: 'ASSIGNMENT_SUBMISSION',
          };
        },
      };
    },
    getPubSubUtils: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return window.location.href;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getDataPageUtils: () => {
      return {
        getPageDataAsync: () => {
          return Promise.resolve(data);
        },
      };
    },
  };
};

interface NetworkDiagramPropsExt extends NetworkDiagramProps {
  Example: string;
}

type Story = StoryObj<NetworkDiagramPropsExt>;
export const Default: Story = {
  render: (args: NetworkDiagramPropsExt) => {
    setPCore(args.Example);
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => '',
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
              showCasePreview: () => {
                /* nothing */
              },
            };
          },
          ignoreSuggestion: () => {
            /* nothing */
          },
          acceptSuggestion: () => {
            /* nothing */
          },
          setInheritedProps: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          },
        };
      },
    };
    return <PegaExtensionsNetworkDiagram {...props} />;
  },
  args: {
    Example: 'example1',
    heading: 'Heading',
    dataPage: '',
    height: '40rem',
    showMinimap: true,
    showControls: true,
    showRefresh: true,
    edgePath: 'bezier',
  },
};
