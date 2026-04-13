import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsLangSwitch } from './index';

type StoryArgs = ComponentProps<typeof PegaExtensionsLangSwitch> & {
  currentLocale: string;
  currentTimezone: string;
};

const meta: Meta<StoryArgs> = {
  title: 'Widgets/Language Switch',
  argTypes: {
    compactView: {
      control: {
        type: 'boolean',
      },
    },
    currentLocale: {
      control: {
        type: 'select',
      },
      options: ['en_EN', 'fr_FR', 'es_ES'],
    },
    currentTimezone: {
      control: {
        type: 'select',
      },
      options: ['UTC', 'America/New_York', 'Asia/Tokyo'],
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsLangSwitch,
};

export default meta;

const setPCore = (currentLocale: string, currentTimezone: string) => {
  (globalThis as typeof globalThis & { PCore?: any }).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getDataPageUtils: () => {
      return {
        getPageDataAsync: (
          _dataPage: string,
          _context: string,
          parameters: { useLocale?: string; useTimeZone?: string },
        ) => {
          return Promise.resolve({ status: parameters.useLocale || parameters.useTimeZone ? 200 : 500 });
        },
      };
    },
    getEnvironmentInfo: () => {
      return {
        getUseLocale: () => currentLocale,
        getTimeZone: () => currentTimezone,
      };
    },
    getLocaleUtils: () => {
      return {
        getTimeZoneInUse: () => currentTimezone,
        setTimezone: () => {},
      };
    },
  };
};

type Story = StoryObj<StoryArgs>;

const buildPConnect = () => {
  return {
    getContextName: () => 'primary',
    getLocalizedValue: (value: string) => value,
  };
};

export const Default: Story = {
  render: (args) => {
    setPCore(args.currentLocale, args.currentTimezone);
    const props = {
      ...args,
      getPConnect: buildPConnect,
    };
    return <PegaExtensionsLangSwitch {...props} />;
  },
  args: {
    currentLocale: 'en_EN',
    currentTimezone: 'UTC',
    changeTimezone: true,
    compactView: false,
    heading: 'Language & Region',
    helperText: 'Choose the language and timezone you want to use across the experience.',
    showCurrentSummary: true,
    showLocaleCode: false,
    prioritizeBrowserTimezone: true,
    Configuration:
      '[{"name":"English","locale":"en_EN"},{"name":"French","locale":"fr_FR"},{"name":"Spanish","locale":"es_ES"}]',
  },
};

export const CompactLanguageOnly: Story = {
  render: (args) => {
    setPCore(args.currentLocale, args.currentTimezone);
    const props = {
      ...args,
      getPConnect: buildPConnect,
    };

    return (
      <div
        style={{
          width: '60px',
          padding: '12px 8px',
          background: '#054A8A',
          borderRadius: '16px',
        }}
      >
        <PegaExtensionsLangSwitch {...props} />
      </div>
    );
  },
  args: {
    currentLocale: 'en_EN',
    currentTimezone: 'UTC',
    changeTimezone: false,
    compactView: true,
    showCurrentSummary: false,
    showLocaleCode: false,
    prioritizeBrowserTimezone: true,
    Configuration: '[{"name":"English","locale":"en_EN"},{"name":"French","locale":"fr_FR"}]',
  },
};
