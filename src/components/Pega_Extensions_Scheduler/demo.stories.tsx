import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsScheduler, type PegaExtensionsSchedulerProps } from './index';

// Define extended props for the story
interface StorySchedulerProps extends PegaExtensionsSchedulerProps {
  eventDate?: string;
  startTime?: string;
  endTime?: string;
}

export default {
  title: 'Fields/Scheduler',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
    eventDate: {
      control: 'text',
      description: 'Start time',
    },
    startTime: {
      control: 'text',
      description: 'Start time',
    },
    endTime: {
      control: 'text',
      description: 'End time',
    },
  },
  component: PegaExtensionsScheduler,
};

const genValue = (args: any) => {
  const obj = {
    EventDate: args.eventDate,
    StartTime: args.startTime,
    EndTime: args.endTime,
    Events: [
      {
        ID: 'A-3004',
        Name: 'John Doe',
        Label: 'Meeting #1',
        StartTime: '080000',
        EndTime: '100000',
        InsKey: 'OPGO8L-CARINSUR-WORK A-3004',
        ObjClass: 'OPGO8L-CarInsur-Work-Appointment',
      },
      {
        ID: 'A-3005',
        Name: 'Frank Smith',
        Label: 'Meeting #2',
        StartTime: '130000',
        EndTime: '150000',
        InsKey: 'OPGO8L-CARINSUR-WORK A-3005',
        ObjClass: 'OPGO8L-CarInsur-Work-Appointment',
      },
      {
        ID: 'A-3006',
        Name: 'John Doe',
        Label: 'Meeting #3',
        StartTime: '140000',
        EndTime: '180000',
        InsKey: 'OPGO8L-CARINSUR-WORK A-3006',
        ObjClass: 'OPGO8L-CarInsur-Work-Appointment',
      },
    ],
  };
  return JSON.stringify(obj);
};
const setPCore = () => {
  (window as any).PCore = {
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local',
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
  };
};

type Story = StoryObj<StorySchedulerProps>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      value: genValue(args),
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: 'C-123',
            };
          },
          getValue: () => 'My new event',
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              createWork: () => {
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
    return <PegaExtensionsScheduler {...props} />;
  },
  args: {
    eventDate: '20240215',
    startTime: '080000',
    endTime: '120000',
    label: 'Scheduler',
    testId: '',
    hideLabel: false,
  },
};
