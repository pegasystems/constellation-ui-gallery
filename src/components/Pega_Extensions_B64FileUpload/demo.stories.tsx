import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input, TextArea } from '@pega/cosmos-react-core';

import ExtensionsB64FileUpload from './index';

const meta: Meta<typeof ExtensionsB64FileUpload> = {
  title: 'Fields/Base 64 File Upload',
  component: ExtensionsB64FileUpload,
  excludeStories: /.*Data$/,
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExtensionsB64FileUpload>;

if (!window.PCore) {
  window.PCore = {} as unknown as typeof PCore;
}

// Hooks live in a named component so the story only builds an element and never runs hooks itself
const UploadFileDemo = (args: any) => {
  const [pegaData, setPegaData] = useState<{
    pyFileName: string;
    pyFileBase64: string;
  }>({ pyFileName: '', pyFileBase64: '' });

  // The component passes property names with a leading dot (".pyFileName"); strip it to match the state keys
  const toKey = (propName: string) => propName.replace(/^\./, '') as keyof typeof pegaData;

  // Keep the latest data in a ref so the PConnect object can stay stable between renders
  const pegaDataRef = useRef(pegaData);
  useEffect(() => {
    pegaDataRef.current = pegaData;
  }, [pegaData]);

  // Stable PConnect: a new object per render would re-trigger the upload component's effect in a loop
  const pConnect = useMemo(
    () =>
      ({
        getLocalizedValue: (value: any) => value,
        getStateProps: () => ({ value: '.pyFileName' }),
        getValue: (propName: string) => pegaDataRef.current[toKey(propName)] || '',
        getTarget: () => ({
          getValue: (propName: string) => pegaDataRef.current[toKey(propName)] || '',
        }),
        getActionsApi: () => ({
          updateFieldValue: (propName: string, propValue: string) => {
            setPegaData((prev) => ({ ...prev, [toKey(propName)]: propValue }));
          },
          triggerFieldChange: (propName: string, propValue: string) => {
            setPegaData((prev) => ({ ...prev, [toKey(propName)]: propValue }));
          },
        }),
      }) as unknown as typeof PConnect,
    [],
  );
  const createPegaPConnect = () => pConnect;

  const uploadProps = {
    fileBase64PropertyName: 'pyFileBase64',
    value: pegaData.pyFileName,
    getPConnect: createPegaPConnect,
    testId: 'bbva-upload-file',
  };

  const fileNameFieldProps = {
    label: 'File Name (pyFileName)',
    placeholder: 'File name will appear here',
    value: pegaData.pyFileName,
    disabled: true,
    onChange: () => {},
    testId: 'file-name-field',
    getPConnect: createPegaPConnect,
  };

  const fileBase64FieldProps = {
    label: 'File Base64 Content (pyFileBase64)',
    placeholder: 'Base64 content will appear here',
    value: pegaData.pyFileBase64,
    disabled: true,
    onChange: () => {},
    rows: 6,
    testId: 'file-base64-field',
    getPConnect: createPegaPConnect,
  };

  return (
    <>
      <div style={{ padding: '2rem' }}>
        <h2>Upload File Component Demo</h2>
        <ExtensionsB64FileUpload {...uploadProps} {...args} />

        <div
          style={{
            marginTop: '2rem',
            padding: '2rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #d0d0d0',
          }}
        >
          <h2 style={{ marginTop: 0 }}>📋 Pega Properties (Real Fields)</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            These are Pega Text and TextArea fields bound to the properties. They update when you upload a file.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input {...fileNameFieldProps} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <TextArea {...fileBase64FieldProps} />
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            padding: '2rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #cccccc',
          }}
        >
          <h2 style={{ marginTop: 0 }}>🧪 Testing & Verification</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Read-only Base64 content for verification purposes</p>

          <TextArea
            label='Base64 Content (for verification)'
            labelHidden={false}
            placeholder='Base64 content will appear here after uploading a file...'
            value={pegaData.pyFileBase64 || ''}
            disabled={false}
            readOnly={true}
            onChange={() => {}}
            rows={8}
            testId='base64-verification-field'
            style={{ marginTop: '1rem', fontFamily: 'monospace' }}
          />

          {pegaData.pyFileBase64 && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#e8f5e9',
                borderRadius: '4px',
                borderLeft: '4px solid #4caf50',
              }}
            >
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#2e7d32' }}>✓ File Data Stored:</p>
              <p style={{ margin: '0.25rem 0', color: '#333' }}>
                <strong>File Name:</strong> {pegaData.pyFileName}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#333' }}>
                <strong>Size:</strong> {pegaData.pyFileBase64.length.toLocaleString()} characters (
                {(pegaData.pyFileBase64.length / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const BaseExtensionsB64FileUpload: Story = {
  name: 'Default',
  render: (args) => <UploadFileDemo {...args} />,
  args: {
    fileBase64PropertyName: 'pyFileBase64',
  },
};
