import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { PegaExtensionsJapaneseInput } from './index';

const meta: Meta<typeof PegaExtensionsJapaneseInput> = {
  title: 'Fields/Japanese Input',
  component: PegaExtensionsJapaneseInput,
  excludeStories: /.*Data$/,
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
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsJapaneseInput>;

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

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: '.TextInputSample',
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
    return <PegaExtensionsJapaneseInput {...props} />;
  },
  args: {
    label: 'TextInput Sample',
    info: 'TextInput Helper Text',
    placeholder: 'TextInput Placeholder',
    testId: 'TextInput-12345678',
    readOnly: false,
    disabled: false,
    required: false,
    labelHidden: false,
    displayMode: undefined,
    errorMessage: '',
    hiraganaToKatakana: false,
    fullToHalf: false,
    lowerToUpper: false,
    japaneseEraToGregorian: false,
    gregorianToJapaneseEra: false,
  },
};
