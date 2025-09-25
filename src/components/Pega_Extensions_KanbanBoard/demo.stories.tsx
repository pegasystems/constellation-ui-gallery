import type { StoryObj } from '@storybook/react-webpack5';
import { DateTimeDisplay, FieldValueItem } from '@pega/cosmos-react-core';
import { Details, DetailsList } from '@pega/cosmos-react-work';
import { PegaExtensionsKanbanBoard } from './index';

export default {
  title: 'Widgets/Kanban Board',
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
    contextProperty: {
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
            id: 'aria-allowed-role',
            enabled: false,
          },
          {
            id: 'landmark-no-duplicate-banner',
            enabled: false,
          },
          {
            id: 'nested-interactive',
            enabled: false,
          },
          {
            id: 'landmark-unique',
            enabled: false,
          },
          {
            id: 'heading-order',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsKanbanBoard,
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
};

const setPCore = () => {
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
              name='Details'
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
              data: Array.from(Object.entries(tasks).map((val: any) => val[1])),
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsKanbanBoard>;
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
          getRawMetadata: () => {},
          getContextName: () => 'primary',
          getContainerManager: () => ({
            addTransientItem: () => {},
            updateTransientData: () => {},
          }),
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
    return <PegaExtensionsKanbanBoard {...props} />;
  },
  args: {
    heading: 'Kanban board',
    createClassname: 'Work-UserStory',
    dataPage: '',
    contextProperty: '',
    height: '30rem',
    groups: 'New,Open,Pending-Review,Resolved-Completed',
    groupProperty: 'pyStatusWork',
    detailsDataPage: '',
    detailsViewName: '',
  },
};
