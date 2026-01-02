import type { Meta, StoryObj } from '@storybook/react-webpack5';

import PegaExtensionsCameraCapture from './index';

import { configProps } from './mock';

const meta: Meta<typeof PegaExtensionsCameraCapture> = {
  title: 'PegaExtensionsCameraCapture',
  component: PegaExtensionsCameraCapture,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsCameraCapture>;

if (!window.PCore) {
  window.PCore = {} as any;
}

window.PCore.getConstants = () => {
  return {
    CASE_INFO: { CASE_INFO : 1 }
  }
}

window.PCore.getAttachmentUtils = () => {
  return {
    linkAttachmentsToCase: () => {
      return Promise.resolve({ ID: 1 });
    },
    uploadAttachment: () => {
      return Promise.resolve({ ID: 1 });
    }
  };
};

window.PCore.getValue = (a) => {
  return a;
}

export const Default: Story = (args: any) => {
  const props = {
    buttonText: args.buttonText,
    getPConnect: () => {
      return {
        getValue: () => {/* nothing */},
        getContextName: () => {/* nothing */}
      };
    }
};

return (
    <>
      <PegaExtensionsCameraCapture {...props} {...args} />
    </>
  );
};

Default.args = {
  buttonText: configProps.buttonText
};
