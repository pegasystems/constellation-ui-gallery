import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsGanttChart } from './index';
import { DateTimeDisplay, FieldValueList, Link } from '@pega/cosmos-react-core';

export default {
  title: 'Widgets/Gantt Chart',
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
    categoryFieldName: {
      table: { disable: true },
    },
    parentFieldName: {
      table: { disable: true },
    },
    dependenciesFieldName: {
      table: { disable: true },
    },
    startDateFieldName: {
      table: { disable: true },
    },
    endDateFieldName: {
      table: { disable: true },
    },
    progressFieldName: {
      table: { disable: true },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsGanttChart,
};

const currentDate = new Date();
const LOCAL_STORAGE_KEY = 'ganttchart';

const getDataFromStorage = () => {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (item !== null) {
    return JSON.parse(item);
  }
  return item;
};

const saveDataToStorage = (data: any) => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

const tasks: any = {
  'P-1001': {
    pyID: 'P-1001',
    Type: 'project',
    pyLabel: 'Mobile App UI Development',
    pyDescription: 'Develop a mobile application UI for seamless user experience.',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
    Progress: 38,
    Dependencies: undefined,
    ProjectID: undefined,
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK P-1001',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
  },
  'T-1001': {
    pyID: 'T-1001',
    Type: 'task',
    pyLabel: 'Accessibility and Testing',
    pyDescription: 'These are ongoing tasks',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 8),
    Progress: 45,
    Dependencies: undefined,
    ProjectID: 'P-1001',
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK T-1001',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
  },
  'T-1002': {
    pyID: 'T-1002',
    Type: 'task',
    pyLabel: 'UX Design',
    pyDescription: 'Crafting intuitive and visually appealing app screens.',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 13, 4),
    Progress: 23,
    Dependencies: undefined,
    ProjectID: 'P-1001',
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK T-1002',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
  },
  'T-1003': {
    pyID: 'T-1003',
    Type: 'task',
    pyLabel: 'UI Development',
    pyDescription: 'Build accessible and prescribed components.',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14, 2),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 2),
    Progress: 30,
    Dependencies: 'T-1002',
    ProjectID: 'P-1001',
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK T-1003',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
  },
  'M-1001': {
    pyID: 'M-1001',
    Type: 'milestone',
    pyLabel: 'UI Design Completed',
    pyDescription: 'Finalized design approved by stakeholders.',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
    Progress: undefined,
    Dependencies: 'T-1002, T-1003',
    ProjectID: 'P-1001',
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK M-1001',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
  },
  'T-1004': {
    pyID: 'T-1004',
    Type: 'task',
    pyLabel: 'Build Storybook',
    pyDescription: 'Update documentation for components',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    Progress: 30,
    Dependencies: 'M-1001',
    ProjectID: 'P-1001',
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK T-1004',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
  },
  'M-1002': {
    pyID: 'M-1002',
    Type: 'milestone',
    pyLabel: 'App UI DONE',
    pyDescription: 'Successful development of App UI.',
    StartDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
    EndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
    Progress: undefined,
    Dependencies: 'T-1001, T-1004, M-1001',
    ProjectID: 'P-1001',
    pyStatusWork: 'New',
    pzInsKey: 'OPGO8L-CARINSUR-WORK M-1002',
    pxObjClass: 'OPGO8L-CarInsur-Work-Appointment',
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
          const fields = [
            {
              name: 'ID',
              value: (
                <h3>
                  <Link href='/' previewable>
                    {id}
                  </Link>
                </h3>
              ),
            },
            { name: 'Description', value: tasks[id].pyDescription },
            { name: 'Progress', value: tasks[id].Progress },
            {
              name: 'Start',
              value: <DateTimeDisplay variant='datetime' value={tasks[id].StartDate} />,
            },
            {
              name: 'End',
              value: <DateTimeDisplay variant='datetime' value={tasks[id].EndDate} />,
            },
          ];
          return <FieldValueList variant='stacked' fields={fields} />;
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
        updateCaseEditFieldsData: (pzInsKey: string, payload: any) => {
          let tasksFromWebStorage = getDataFromStorage();
          if (tasksFromWebStorage) {
            const taskIndex = tasksFromWebStorage.findIndex((x: any) => x.pzInsKey === pzInsKey);
            let task = tasksFromWebStorage[taskIndex];
            task = { ...task, ...payload[pzInsKey] };
            tasksFromWebStorage = [
              ...tasksFromWebStorage.slice(0, taskIndex),
              task,
              ...tasksFromWebStorage.slice(taskIndex + 1),
            ];
            saveDataToStorage(tasksFromWebStorage);
          }
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
          const ganttData = getDataFromStorage();
          const mockData = Array.from(Object.entries(tasks).map((val: any) => val[1]));
          if (!ganttData) saveDataToStorage(mockData);
          return Promise.resolve({
            data: {
              data: ganttData || mockData,
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsGanttChart>;
export const Default: Story = {
  render: (args) => {
    setPCore();
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

    const otherProps = {
      categoryFieldName: 'Type',
      parentFieldName: 'ProjectID',
      dependenciesFieldName: 'Dependencies',
      startDateFieldName: 'StartDate',
      endDateFieldName: 'EndDate',
      progressFieldName: 'Progress',
    };
    return <PegaExtensionsGanttChart {...props} {...otherProps} />;
  },
  args: {
    heading: 'Gantt chart',
    createClassname: 'Work-Class1',
    defaultViewMode: 'Daily',
    showDetailsColumns: true,
    dataPage: '',
    detailsDataPage: '',
    detailsViewName: '',
  },
};
