import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsMaskedInput, type MaskedInputProps } from './index';

export default {
  title: 'Fields/Masked Input',
  argTypes: {
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
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'autocomplete-valid',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsMaskedInput,
};

const setPCore = () => {
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
  };
};

const setPConnect = () => {
  return {
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
};

type Story = StoryObj<typeof PegaExtensionsMaskedInput>;

const MaskedInputDemo = (inputs: MaskedInputProps) => {
  return {
    render: (args: MaskedInputProps) => {
      setPCore();
      const props = {
        ...args,
        additionalProps: { style: { maxWidth: '80ch' } },
        getPConnect: setPConnect,
      };
      return <PegaExtensionsMaskedInput {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = MaskedInputDemo({
  label: 'Zip Code',
  mask: '00000-0000',
  value: '',
  helperText: '#####-####',
  testId: 'maskedinput',
  placeholder: '',
  validatemessage: '',
  disabled: false,
  readOnly: false,
  required: false,
  hideLabel: false,
  hasSuggestions: false,
});

export const IBAN: Story = MaskedInputDemo({
  label: 'IBAN (International Bank Account Number)',
  mask: 'AA00 0000 0000 0000 0000 0000 A00',
  helperText: '#### #### #### #### #### #### ###',
});

export const CreditCard: Story = MaskedInputDemo({
  label: 'Credit Card number',
  mask: '0000 0000 0000 0000',
});

export const IPAddress: Story = MaskedInputDemo({
  label: 'IP Address',
  mask: '0[00].0[00].0[00].0[00]',
  helperText: '(0-255).(0-255).(0-255).(0-255)',
});

export const ZipCode: Story = MaskedInputDemo({
  label: 'Zip Code (extended code optional)',
  mask: '00000[-0000]',
  helperText: '#####-####',
});

export const SSN: Story = MaskedInputDemo({
  label: 'SSN',
  mask: '000 00 0000',
  helperText: '### ## ####',
});
