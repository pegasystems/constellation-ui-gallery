import type { StoryObj } from '@storybook/react';
import { PegaExtensionsDisplayPDF, DisplayMode } from './index';
import { useState, useEffect } from 'react';

export default {
  title: 'Fields/Display PDF',
  argTypes: {
    value: {
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
  component: PegaExtensionsDisplayPDF,
};

const blob2base64 = (blob: Blob, mimeType: string) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrlPrefix = `data:${mimeType};base64,`;
      const base64WithDataUrlPrefix = reader.result;
      const base64 =
        typeof base64WithDataUrlPrefix === 'string' ? base64WithDataUrlPrefix.replace(dataUrlPrefix, '') : '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const getBinary = async () => {
  const response = await fetch('./SamplePDF.pdf');
  if (response.blob) {
    const blob = await response.blob();
    return blob2base64(blob, 'application/pdf');
  }
  return '';
};

const setPCore = (url: string) => {
  (window as any).PCore = {
    getLocaleUtils: () => {
      return {
        getLocaleValue: (val: string) => {
          return val;
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  pxObjClass: 'Link-Attachment',
                  pyLabel: 'File #1',
                  pyContext: url,
                },
                {
                  pxObjClass: 'Link-Attachment',
                  pyLabel: 'File #2',
                  pyContext: url,
                },
                {
                  pxObjClass: 'Link-Attachment',
                  pyLabel: 'File #3',
                  pyContext: url,
                },
              ],
            },
          });
        },
      };
    },
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsDisplayPDF>;

export const Default: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [value, setValue] = useState<string | null>(null);

      useEffect(() => {
        const fetchData = async () => {
          const value: any = await getBinary();
          setValue(value);
          setPCore(value);
        };
        fetchData();
      }, []);

      const props = {
        ...args,
        value,
        getPConnect: () => {
          return {
            getContextName: () => '',
            getValue: () => 'C-123',
          };
        },
      };

      return <PegaExtensionsDisplayPDF {...{ ...props, value: value || '' }} />;
    };

    return <Wrapper />;
  },
  args: {
    label: 'File #234-23',
    width: '100%',
    height: 400,
    showToolbar: true,
    dataPage: '',
    hideLabel: false,
    displayMode: DisplayMode.Editable,
  },
};
