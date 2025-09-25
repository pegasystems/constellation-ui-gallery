import type { StoryObj } from '@storybook/react-webpack5';
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

const blob2base64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(',')[1];
        console.log('Base64 length:', base64?.length);
        resolve(base64 || '');
      } else {
        reject(new Error('Failed to read blob as data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const getBinary = async () => {
  try {
    const response = await fetch('/SamplePDF.pdf');
    console.log('PDF fetch response status:', response.status);
    console.log('PDF fetch response ok:', response.ok);

    if (response.ok && response.blob) {
      const blob = await response.blob();
      console.log('PDF blob size:', blob.size);
      return blob2base64(blob);
    }
    console.warn('PDF fetch failed or no blob available');
    // Fallback to a minimal valid PDF for testing
    return 'JVBERi0xLjQKJcOkw7zDtsO8CjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgovVHlwZSAvUGFnZQo+PgpzdHJlYW0KZW5kb2JqCjMgMCBvYmoKMTEKZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsyIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNTggMDAwMDAgbgowMDAwMDAwMTE1IDAwMDAwIG4KMDAwMDAwMDM3OCAwMDAwMCBuCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCA0IDAgUgo+PgpzdGFydHhyZWYKNDk3CiUlRU9G';
  } catch (error) {
    console.error('PDF fetch error:', error);
    // Fallback to a minimal valid PDF for testing
    return 'JVBERi0xLjQKJcOkw7zDtsO8CjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgovVHlwZSAvUGFnZQo+PgpzdHJlYW0KZW5kb2JqCjMgMCBvYmoKMTEKZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsyIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNTggMDAwMDAgbgowMDAwMDAwMTE1IDAwMDAwIG4KMDAwMDAwMDM3OCAwMDAwMCBuCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCA0IDAgUgo+PgpzdGFydHhyZWYKNDk3CiUlRU9G';
  }
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
