import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsCaseReference } from './index';

export default {
  title: 'Fields/Case Reference',
  argTypes: {
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
    selectionProperty: {
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
  component: PegaExtensionsCaseReference,
};

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
  } as unknown as typeof PCore;
};

type Story = StoryObj<typeof PegaExtensionsCaseReference>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: 'C-123',
            };
          },
        } as unknown as typeof PConnect;
      },
    };
    return <PegaExtensionsCaseReference {...props} />;
  },
  args: {
    value: 'C-123',
    selectionProperty: 'WORK-ITEM C-123',
    allowPreview: true,
    refCaseClassName: 'PegaSample-Task',
  },
};
