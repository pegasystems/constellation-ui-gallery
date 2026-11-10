import { useRef, useState, useEffect } from 'react';
import { Button, Icon, Progress, Text, registerIcon, withConfiguration } from '@pega/cosmos-react-core';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';
import '../shared/create-nonce';

import StyledB64FileUploadWrapper from './styles';

registerIcon(timesIcon);

type LoadPhase = 'idle' | 'reading' | 'encoding';

// Reads the whole file as bytes.
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

// Encodes bytes to Base64 in chunks, yielding between them so the spinner keeps animating.
// The chunk size is a multiple of 3, so every chunk encodes without padding and the parts join cleanly.
const CHUNK_SIZE = 3 * 64 * 1024;
const encodeBytesToBase64 = async (bytes: Uint8Array): Promise<string> => {
  const parts: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    const chunk = bytes.subarray(offset, offset + CHUNK_SIZE);
    // String.fromCharCode takes one argument per byte, so feed it in smaller pieces to stay within engine limits
    let binary = '';
    for (let i = 0; i < chunk.length; i += 0x8000) {
      binary += String.fromCharCode(...chunk.subarray(i, i + 0x8000));
    }
    parts.push(btoa(binary));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return parts.join('');
};

type B64FileUploadProps = {
  fileBase64PropertyName: string;
  value?: string;
};

export const PegaExtensionsB64FileUpload = (props: B64FileUploadProps & any) => {
  const { fileBase64PropertyName, value } = props;

  const getPConnect = (props as any).getPConnect;
  const testId = (props as any).testId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  // The file name lives in the control's own property, so the stored value is shown on load
  const [fileName, setFileName] = useState<string>(value || '');
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<LoadPhase>('idle');
  // Identifies the current load so results from a superseded or removed file are ignored
  const loadIdRef = useRef(0);
  const PConnect = getPConnect();

  // The control's own property reference (the property this component is bound to)
  const fileNameProp: string = PConnect.getStateProps().value;

  // Normalize property names to include dot prefix
  const normalizePropertyName = (propName: string) => {
    return propName.startsWith('.') ? propName : `.${propName}`;
  };
  const normalizedFileBase64Prop = normalizePropertyName(fileBase64PropertyName);

  // Update Pega properties when file data changes
  useEffect(() => {
    if (fileBase64 && fileName && fileNameProp && fileBase64PropertyName) {
      try {
        const actionsApi = PConnect.getActionsApi() as any;

        if (actionsApi && actionsApi.updateFieldValue) {
          actionsApi.updateFieldValue(fileNameProp, fileName);
          actionsApi.updateFieldValue(normalizedFileBase64Prop, fileBase64);
        } else {
          console.error('updateFieldValue not available');
        }
      } catch (error) {
        console.error('Error updating file properties:', error);
      }
    }
  }, [fileBase64, fileName, fileNameProp, fileBase64PropertyName, PConnect, fileSize, normalizedFileBase64Prop]);

  // After a reload the file name comes back from the control's value but the size does not.
  // Derive it from the stored Base64 content (about 3/4 of its length, minus the padding characters).
  useEffect(() => {
    if (!fileName || fileSize > 0) return;
    try {
      const storedBase64 = PConnect.getValue(normalizedFileBase64Prop);
      if (typeof storedBase64 === 'string' && storedBase64.length > 0) {
        const padding = storedBase64.endsWith('==') ? 2 : storedBase64.endsWith('=') ? 1 : 0;
        const sizeInBytes = (storedBase64.length * 3) / 4 - padding;
        setFileSize(sizeInBytes / (1024 * 1024));
      }
    } catch (error) {
      console.error('Error reading stored file content:', error);
    }
  }, [fileName, fileSize, normalizedFileBase64Prop, PConnect]);

  const handleFileSelect = async (file: File) => {
    const loadId = ++loadIdRef.current;
    const isCurrent = () => loadId === loadIdRef.current;

    setPhase('reading');
    try {
      const buffer = await readFileAsArrayBuffer(file);
      if (!isCurrent()) return;

      const base64String = await encodeBytesToBase64(new Uint8Array(buffer));
      if (!isCurrent()) return;

      setFileName(file.name);
      setFileBase64(base64String);
      setFileSize(file.size / (1024 * 1024));
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      if (isCurrent()) {
        setPhase('idle');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    // Cancel any load still in progress
    loadIdRef.current++;
    setPhase('idle');
    setFileName('');
    setFileBase64('');
    setFileSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      const actionsApi = PConnect.getActionsApi() as any;
      if (actionsApi && actionsApi.updateFieldValue) {
        actionsApi.updateFieldValue(fileNameProp, '');
        actionsApi.updateFieldValue(normalizedFileBase64Prop, '');
      }
    } catch (error) {
      console.error('Error clearing file properties:', error);
    }
  };

  return (
    <StyledB64FileUploadWrapper data-testid={testId}>
      {!fileName ? (
        <div
          className={`upload-box ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {phase === 'idle' ? (
            <>
              <Icon
                name='paperclip'
                role='img'
                aria-label='attachment'
                style={{ height: '2rem', width: '2rem', marginBottom: '0.5rem' }}
              />
              <Text as='p' variant='secondary' className='upload-text'>
                {PConnect.getLocalizedValue('Drag and drop a file here or', '', '')}
              </Text>
              <Button variant='secondary' compact onClick={() => fileInputRef.current?.click()}>
                {PConnect.getLocalizedValue('Select file', '', '')}
              </Button>
            </>
          ) : (
            <div className='upload-progress'>
              <Text as='p' variant='secondary' className='upload-text'>
                {PConnect.getLocalizedValue('Reading...', '', '')}
              </Text>
              <Progress variant='ring' placement='inline' />
            </div>
          )}
          <input
            ref={fileInputRef}
            type='file'
            onChange={handleInputChange}
            style={{ display: 'none' }}
            aria-label='Select file'
          />
        </div>
      ) : (
        <div className='file-loaded'>
          <div className='file-info'>
            <Icon
              name='paperclip'
              role='img'
              aria-label='file'
              style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem' }}
            />
            <div className='file-details'>
              <Text className='file-name'>{fileName}</Text>
              {fileSize > 0 && (
                <Text variant='secondary' className='file-size'>
                  ({fileSize.toFixed(2)} MB)
                </Text>
              )}
            </div>
          </div>
          <div className='file-actions'>
            <Button
              variant='simple'
              label={PConnect.getLocalizedValue('Remove file', '', '')}
              icon
              compact
              onClick={handleRemoveFile}
            >
              <Icon name='times' />
            </Button>
          </div>
        </div>
      )}
    </StyledB64FileUploadWrapper>
  );
};

export default withConfiguration(PegaExtensionsB64FileUpload);
