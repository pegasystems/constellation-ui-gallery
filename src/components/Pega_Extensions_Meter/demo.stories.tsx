import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsMeter, type MeterProps } from './index';

export default {
  title: 'Fields/Meter',
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
    },
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
    displayMode: {
      options: ['', 'DISPLAY_ONLY'],
      control: { type: 'radio', labels: { '': 'EDITABLE' } },
    },
    variant: {
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
  component: PegaExtensionsMeter,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {
          CASE_INFO_ID: 'ID',
        },
      };
    },
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
    getDataApiUtils: () => {
      return {
        getData: (dataPage: string) => {
          if (dataPage === 'test') {
            return Promise.resolve({
              data: {
                data: [
                  { label: 'Pass', color: '#34a35d', value: 16 },
                  { label: 'Failed', color: '#fb243d', value: 3 },
                  { label: 'Blocked', color: '#f5fa60', value: 6 },
                  { label: 'Not Executed', color: '#c084fc', value: 10 },
                ],
              },
            });
          }
          return Promise.resolve({
            data: {
              data: [
                { label: 'Apps', color: '#34d399', value: 16 },
                { label: 'Messages', color: '#fbbf24', value: 8 },
                { label: 'Media', color: '#60a5fa', value: 24 },
                { label: 'System', color: '#c084fc', value: 10 },
              ],
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsMeter>;

const MeterDemo = (inputs: MeterProps) => {
  return {
    render: (args: MeterProps) => {
      setPCore();
      const props = {
        ...args,
        getPConnect: () => {
          return {
            getValue: () => 'C-123',
            getContextName: () => '',
            getStateProps: () => {
              return {
                value: 'C-123',
              };
            },
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
      return <PegaExtensionsMeter {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = MeterDemo({
  displayMode: '',
  value: 50,
  dataPage: '',
  label: 'Tasks completed',
  hideLabel: false,
  color: '#34d399',
  additionalInfo: 'Number of tasks completed out of total tasks',
  showMetaData: false,
  totalTasks: 10,
});

export const Grouped: Story = MeterDemo({
  dataPage: 'test',
  label: 'Test coverage',
  showMetaData: true,
  displayMode: '',
});

export const Grouped1: Story = MeterDemo({
  dataPage: 'storage',
  label: 'System storage',
  showMetaData: true,
  totalTasks: 100,
  displayMode: '',
});
