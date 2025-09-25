import type { StoryObj } from '@storybook/react-webpack5';
import { FieldValueItem, DateTimeDisplay } from '@pega/cosmos-react-core';
import { Details, DetailsList } from '@pega/cosmos-react-work';
import { PegaExtensionsCardGallery } from './index';

export default {
  title: 'Widgets/Card Gallery',
  argTypes: {
    detailsDataPage: {
      table: {
        disable: true,
      },
    },
    detailsViewName: {
      table: {
        disable: true,
      },
    },
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
  },
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'landmark-no-duplicate-banner',
            enabled: false,
          },
          {
            id: 'landmark-unique',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsCardGallery,
};

const tasks: any = {
  'A-1001': {
    pyStatusWork: 'New',
    pyLabel: 'Complete the assessment',
    pyDescription: 'Need to review and complete the work',
    pyDueDate: '2024-03-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Marc Doe',
    pyID: 'A-1001',
    pzInsKey: 'Task A-1001',
  },
  'A-1002': {
    pyStatusWork: 'Open',
    pyLabel: 'Code development of feature #1',
    pyDescription: 'Complete code and unit test',
    pyDueDate: '2024-02-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Sue Lee',
    pyID: 'A-1002',
    pzInsKey: 'Task A-1002',
  },
  'A-1003': {
    pyStatusWork: 'Open',
    pyLabel: 'Integration Testing',
    pyDescription: 'Testing against application A',
    pyDueDate: '2024-02-20T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Joe Smith',
    pyID: 'A-1003',
    pzInsKey: 'Task A-1003',
  },
  'A-1004': {
    pyStatusWork: 'Pending-Review',
    pyLabel: 'Code Review',
    pyDescription: 'Review the code',
    pyDueDate: '2024-03-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Sue Lee',
    pyID: 'A-1004',
    pzInsKey: 'Task A-1004',
  },
  'A-1005': {
    pyStatusWork: 'Open',
    pyLabel: 'Design',
    pyDescription: 'Finalize the design',
    pyDueDate: '2024-01-11T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Marc Doe',
    pyID: 'A-1005',
    pzInsKey: 'Task A-1005',
  },
  'A-1006': {
    pyStatusWork: 'New',
    pyLabel: 'Complete the assessment',
    pyDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    pyDueDate: '2024-03-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Marc Doe',
    pyID: 'A-1006',
    pzInsKey: 'Task A-1006',
  },
  'A-1007': {
    pyStatusWork: 'Open',
    pyLabel: 'Code development of feature #1',
    pyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    pyDueDate: '2024-02-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Sue Lee',
    pyID: 'A-1007',
    pzInsKey: 'Task A-1007',
  },
  'A-1008': {
    pyStatusWork: 'Open',
    pyLabel: 'Integration Testing',
    pyDescription: 'Testing against application A',
    pyDueDate: '2024-02-20T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Joe Smith',
    pyID: 'A-1008',
    pzInsKey: 'Task A-1008',
  },
  'A-1009': {
    pyStatusWork: 'New',
    pyLabel: 'Complete the assessment',
    pyDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ',
    pyDueDate: '2024-03-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Marc Doe',
    pyID: 'A-1009',
    pzInsKey: 'Task A-1009',
  },
  'A-1010': {
    pyStatusWork: 'Open',
    pyLabel: 'Code development of feature #1',
    pyDescription:
      'Complete code and unit test.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    pyDueDate: '2024-02-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Sue Lee',
    pyID: 'A-1010',
    pzInsKey: 'Task A-1010',
  },
  'A-1011': {
    pyStatusWork: 'Open',
    pyLabel: 'Integration Testing',
    pyDescription: 'Testing against application A',
    pyDueDate: '2024-02-20T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Joe Smith',
    pyID: 'A-1011',
    pzInsKey: 'Task A-1011',
  },
  'A-1012': {
    pyStatusWork: 'New',
    pyLabel: 'Complete the assessment',
    pyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
    pyDueDate: '2024-03-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Marc Doe',
    pyID: 'A-1012',
    pzInsKey: 'Task A-1012',
  },
  'A-1013': {
    pyStatusWork: 'Open',
    pyLabel: 'Code development of feature #1',
    pyDescription: 'Complete code and unit test',
    pyDueDate: '2024-02-01T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Sue Lee',
    pyID: 'A-1013',
    pzInsKey: 'Task A-1013',
  },
  'A-1014': {
    pyStatusWork: 'Open',
    pyLabel: 'Integration Testing',
    pyDescription: 'Testing against application A',
    pyDueDate: '2024-02-20T00:00:00.000Z',
    pxObjClass: 'Work-UserStory',
    pxCreateOpName: 'Joe Smith',
    pyID: 'A-1014',
    pzInsKey: 'Task A-1014',
  },
};

const setPCore = (args: any) => {
  (window as any).PCore = {
    getLocaleUtils: () => {
      return {
        getLocaleValue: (val: string) => {
          return val;
        },
      };
    },
    createPConnect: () => ({
      getPConnect: () => ({
        createComponent: (meta: any) => {
          const id = meta.config.pyID;
          const highlightedData = [<FieldValueItem key='CaseID' variant='stacked' name='CaseID' value={id} />];
          return (
            <Details
              name={''}
              highlightedData={highlightedData}
              collapsible={false}
              columns={{
                a: (
                  <DetailsList
                    items={[
                      {
                        id: 'Description',
                        name: 'Description',
                        value: tasks[id].pyDescription,
                      },
                      {
                        id: 'Assigned To',
                        name: 'Assigned To',
                        value: tasks[id].pxCreateOpName,
                      },
                      {
                        id: 'Due date',
                        name: 'Due date',
                        value: <DateTimeDisplay variant='date' value={tasks[id].pyDueDate} />,
                      },
                    ]}
                  />
                ),
              }}
            />
          );
        },
      }),
    }),
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getViewResources: () => {
      return {
        fetchViewResources: () => {
          return {
            config: {
              showLabel: true,
            },
          };
        },
        updateViewResources: () => {},
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
    getConstants: () => {
      return {
        PUB_SUB_EVENTS: {
          EVENT_DASHBOARD_FILTER_CHANGE: 'EVENT_DASHBOARD_FILTER_CHANGE',
          EVENT_DASHBOARD_FILTER_CLEAR_ALL: 'EVENT_DASHBOARD_FILTER_CLEAR_ALL',
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getCaseEditLock: () => {
          return Promise.resolve({
            headers: {
              etag: 'xxx',
            },
          });
        },
        updateCaseEditFieldsData: () => {
          return Promise.resolve();
        },
        getDataObjectView: () => {
          return Promise.resolve({
            data: {
              data: {
                content: {
                  pyStatusWork: 'New',
                },
              },
            },
          });
        },
        getData: () => {
          return Promise.resolve({
            data: {
              data: Array.from(
                Object.entries(tasks)
                  .splice(0, args.numCards)
                  .map((val: any) => val[1]),
              ),
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsCardGallery>;
export const Default: Story = {
  render: (args) => {
    setPCore(args);
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => 'primary',
          getContainerManager: () => ({
            addTransientItem: () => {},
            updateTransientData: () => {},
          }),
          getLocalizedValue: (val: string) => {
            return val;
          },
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              openLocalAction: (id: string) => {
                alert(`Opening local action for case:${id}`);
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
    return <PegaExtensionsCardGallery {...props} />;
  },
  args: {
    heading: 'Card Gallery',
    createClassname: 'Work-UserStory',
    dataPage: '',
    useInDashboard: false,
    minWidth: '400px',
    rendering: 'horizontal',
    detailsDataPage: '',
    detailsViewName: '',
    numCards: 10,
  },
};
