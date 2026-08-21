import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsToggle, type ToggleProps } from './index';

export default {
  title: 'Fields/Toggle',
  argTypes: {
    hideLabel: {
      control: 'boolean',
    },
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
    additionalProps: {
      table: {
        disable: true,
      },
    },
    displayMode: {
      table: {
        disable: true,
      },
    },
    displayValue: {
      control: 'select',
      options: ['Yes/No', 'True/False'],
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
    },
  },
  component: PegaExtensionsToggle,
} satisfies Meta<typeof PegaExtensionsToggle>;

const setPCore = () => {
  window.PCore = {
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
  } as unknown as typeof PCore;
};

const setPConnect = () => {
  return {
    getStateProps: () => {
      return {
        value: '.IsActive',
      };
    },
    getActionsApi: () => {
      return {
        updateFieldValue: () => {
          /* nothing */
        },
        triggerFieldChange: () => {
          /* nothing */
        },
      };
    },
    ignoreSuggestion: () => {
      /* nothing */
    },
  } as unknown as typeof PConnect;
};

type Story = StoryObj<typeof PegaExtensionsToggle>;

const ToggleDemo = (inputs: Omit<ToggleProps, 'getPConnect'>) => {
  return {
    render: (args: Omit<ToggleProps, 'getPConnect'>) => {
      setPCore();
      const props = {
        ...args,
        getPConnect: setPConnect as () => typeof PConnect,
      };
      return <PegaExtensionsToggle {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = ToggleDemo({
  label: 'Active status',
  caption: 'Is active',
  value: false,
  helperText: 'Turn on to mark this record as active',
  testId: 'toggle-demo',
  validatemessage: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  trueLabel: 'Yes',
  falseLabel: 'No',
  displayValue: 'Yes/No',
});

export const On: Story = ToggleDemo({
  label: 'Active status',
  caption: 'Is active',
  value: true,
  helperText: '',
  testId: 'toggle-on',
  validatemessage: '',
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  trueLabel: 'Yes',
  falseLabel: 'No',
  displayValue: 'Yes/No',
});

export const ReadOnly: Story = ToggleDemo({
  label: 'Active status',
  caption: 'Is active',
  value: true,
  helperText: '',
  testId: 'toggle-readonly',
  validatemessage: '',
  hideLabel: false,
  disabled: false,
  readOnly: true,
  required: false,
  trueLabel: 'Yes',
  falseLabel: 'No',
  displayValue: 'Yes/No',
});
