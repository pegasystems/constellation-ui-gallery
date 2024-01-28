import type { StoryObj } from '@storybook/react';
import PegaExtensionsCalendar from './index';

export default {
  title: 'Widgets/Calendar',
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
  component: PegaExtensionsCalendar
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
          return undefined;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle'
          };
        }
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
                  pxUpdateDateTime: '2023-07-21T18:45:53.817Z',
                  StartTime: '08:00:00',
                  ConferenceAccessLink: null,
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1004',
                  pxUpdateOpName: 'Marc Doe',
                  SessionDate: '2023-07-20',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1004',
                  pxCreateDateTime: '2023-07-21T18:45:38.411Z',
                  pyDescription: null,
                  pyLabel: 'Appointment',
                  pxCreateOpName: 'Marc Doe'
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
                  SessionDate: '2023-07-20',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1003',
                  pxCreateDateTime: '2023-07-21T18:43:07.895Z',
                  pyDescription: null,
                  pyLabel: 'Demo Acme',
                  pxCreateOpName: 'Marc Doe'
                },
                {
                  pyStatusWork: 'New',
                  Category: 'remote',
                  EndTime: '15:00:00',
                  pxUpdateDateTime: '2023-07-21T18:43:03.354Z',
                  StartTime: '10:00:00',
                  ConferenceAccessLink: 'http://pega.com',
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1002',
                  pxUpdateOpName: 'Marc Doe',
                  SessionDate: '2023-07-21',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1002',
                  pxCreateDateTime: '2023-07-21T18:42:11.140Z',
                  pyDescription: '1-1 meeting',
                  pyLabel: 'Meeting with Joe Smith',
                  pxCreateOpName: 'Marc Doe'
                },
                {
                  pyStatusWork: 'New',
                  Category: 'in person',
                  EndTime: '20:00:00',
                  pxUpdateDateTime: '2023-07-21T18:42:08.044Z',
                  StartTime: '13:00:00',
                  ConferenceAccessLink: 'http://www.pega.com',
                  pzInsKey: 'OPGO8L-CARINSUR-WORK A-1001',
                  pxUpdateOpName: 'Marc Doe',
                  SessionDate: '2023-07-21',
                  pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
                  pyID: 'A-1001',
                  pxCreateDateTime: '2023-07-21T18:41:09.060Z',
                  pyDescription: 'Install a boiler\n',
                  pyLabel: 'Install boiler',
                  pxCreateOpName: 'Marc Doe'
                }
              ]
            }
          });
        }
      };
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsCalendar>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              createWork: (className: string) => {
                // eslint-disable-next-line no-alert
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
    return <PegaExtensionsCalendar {...props} />;
  },
  args: {
    heading: 'Heading',
    createClassname: 'Work-Class1',
    defaultViewMode: 'Monthly',
    nowIndicator: true,
    weekendIndicator: true,
    dataPage: ''
  }
};
