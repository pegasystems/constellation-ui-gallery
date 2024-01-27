import type { StoryObj } from '@storybook/react';
import PegaExtensionsNetworkDiagram from './index';

export default {
  title: 'Widgets/Network Diagram',
  argTypes: {
    dataPage: {
      table: {
        disable: true
      }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsNetworkDiagram
};

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local'
      };
    },
    getEvents: () => {
      return {
        getCaseEvent: () => {
          return {
            ASSIGNMENT_SUBMISSION: 'ASSIGNMENT_SUBMISSION'
          };
        }
      };
    },
    getPubSubUtils: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        }
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return window.location.href;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle'
          };
        }
      };
    },
    getDataPageUtils: () => {
      return {
        getPageDataAsync: () => {
          return Promise.resolve({
            pyNodes: [
              {
                pyID: '1',
                pyLabel: 'New Wave Energy Solutions',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '2',
                pyLabel: 'New Wave Americas Inc',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '3',
                pyLabel: 'New Wave Asia Ltd.',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '4',
                pyLabel: 'New Wave Equity',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '6',
                pyLabel: 'New Wave Wind',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '7',
                pyLabel: 'New Wave Hydro',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '8',
                pyLabel: 'New Wave Solar',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '9',
                pyLabel: 'European Road Tours',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '10',
                pyLabel: 'ABC Entertainment',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '11',
                pyLabel: 'New Wave Europe Ltd.',
                pyCategory: 'Corporation',
                pzInsKey: 'XXX',
                pyClassName: 'Work-Case'
              },
              {
                pyID: '20',
                pyLabel: 'Talia Green',
                pyCategory: 'Individual'
              },
              {
                pyID: '21',
                pyLabel: 'Karina Dalton',
                pyCategory: 'Individual'
              },
              {
                pyID: '22',
                pyLabel: 'Sally Jones',
                pyCategory: 'Individual'
              },
              {
                pyID: '23',
                pyLabel: 'Magdalena Leanez',
                pyCategory: 'Individual'
              }
            ],
            pyEdges: [
              {
                pyFrom: '2',
                pyTo: '1',
                pyLabel: 'Division',
                pyCategory: 'division'
              },
              {
                pyFrom: '3',
                pyTo: '1',
                pyLabel: 'Division',
                pyCategory: 'division'
              },
              {
                pyFrom: '9',
                pyTo: '1',
                pyLabel: 'Division',
                pyCategory: 'division'
              },
              {
                pyFrom: '11',
                pyTo: '1',
                pyLabel: 'Subsidiary',
                pyCategory: 'subsidiary'
              },
              {
                pyFrom: '2',
                pyTo: '4',
                pyLabel: 'Subsidiary',
                pyCategory: 'subsidiary'
              },
              {
                pyFrom: '2',
                pyTo: '6',
                pyLabel: 'Subsidiary',
                pyCategory: 'subsidiary'
              },
              {
                pyFrom: '7',
                pyTo: '11',
                pyLabel: 'Subsidiary',
                pyCategory: 'subsidiary'
              },
              {
                pyFrom: '8',
                pyTo: '11',
                pyLabel: 'Subsidiary',
                pyCategory: 'subsidiary'
              },
              {
                pyFrom: '23',
                pyTo: '2',
                pyLabel: 'Majority shareholder',
                pyCategory: 'ownership'
              },
              {
                pyFrom: '20',
                pyTo: '1',
                pyLabel: 'Majority shareholder',
                pyCategory: 'ownership'
              },
              {
                pyFrom: '20',
                pyTo: '10',
                pyLabel: 'UBO 20%',
                pyCategory: 'ownership'
              },
              {
                pyFrom: '22',
                pyTo: '11',
                pyLabel: 'UBO 17%',
                pyCategory: 'ownership'
              },
              {
                pyFrom: '22',
                pyTo: '8',
                pyLabel: 'UBO 23%',
                pyCategory: 'ownership'
              },
              {
                pyFrom: '21',
                pyTo: '7',
                pyLabel: 'UBO 24%',
                pyCategory: 'ownership'
              }
            ]
          });
        }
      };
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsNetworkDiagram>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      dataPage: '',
      heading: args.heading,
      height: args.height,
      showMinimap: args.showMinimap,
      showControls: args.showControls,
      showRefresh: args.showRefresh,
      edgePath: args.edgePath,
      getPConnect: () => {
        return {
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
              }
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
          }
        };
      }
    };
    return <PegaExtensionsNetworkDiagram {...props} />;
  },
  args: {
    heading: 'Heading',
    height: '40rem',
    showMinimap: true,
    showControls: true,
    showRefresh: true,
    edgePath: 'bezier'
  }
};
