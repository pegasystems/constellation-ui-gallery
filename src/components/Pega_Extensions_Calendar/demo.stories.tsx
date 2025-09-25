import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsCalendar } from './index';

export default {
  title: 'Widgets/Calendar',
  argTypes: {
    dataPage: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
    dateProperty: {
      table: {
        disable: true,
      },
    },
    startTimeProperty: {
      table: {
        disable: true,
      },
    },
    endTimeProperty: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsCalendar,
};

const setPCore = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const toDateString = (date: Date) => date.toISOString().split('T')[0];

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
          return undefined;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  pyStatusWork: 'New',
                  Category: 'in person',
                  EndTime: '10:00:00',
                  pxUpdateDateTime: '2025-07-21T18:45:53.817Z',
                  StartTime: '08:00:00',
                  ConferenceAccessLink: null,
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  SessionDate: toDateString(today),
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1004',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyDescription: null,
                  pyLabel: 'Appointment',
                  pxCreateOpName: 'Marc Doe',
                },
                {
                  pyStatusWork: 'New',
                  Category: 'in person',
                  EndTime: '14:00:00',
                  pxUpdateDateTime: '2023-07-21T18:43:40.100Z',
                  StartTime: '09:00:00',
                  ConferenceAccessLink: null,
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1003',
                  pxUpdateOpName: 'Marc Doe',
                  SessionDate: toDateString(tomorrow),
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1003',
                  pxCreateDateTime: '2023-07-21T18:43:07.895Z',
                  pyDescription: null,
                  pyLabel: 'Demo Acme',
                  pxCreateOpName: 'Marc Doe',
                },
              ],
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsCalendar>;
export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              createWork: (className: string) => {
                alert(`Create case type with className:${className}`);
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
    return <PegaExtensionsCalendar {...props} />;
  },
  args: {
    heading: 'Heading',
    createClassname: 'Work-Class1',
    defaultViewMode: 'Monthly',
    nowIndicator: true,
    weekendIndicator: true,
    dataPage: '',
    dateProperty: 'SessionDate',
    startTimeProperty: 'StartTime',
    endTimeProperty: 'EndTime',
  },
};
