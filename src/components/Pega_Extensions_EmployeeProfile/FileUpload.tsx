// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react';

type FileUploadResponse = {
  ID: string;
  category: string;
  clientFileID: string;
  filename: string;
  type: string;
};

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const generateUniqueID = () => '_' + Math.random().toString(36).substr(2, 9);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadProgress('');
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const uniqueID = generateUniqueID();

    // Clone and extend file object
    const fileWithMetadata = Object.assign({}, selectedFile, {
      ID: uniqueID,
      clientFileID: uniqueID,
      category: 'Resume',
    });

    // Upload progress callback
    const onUploadProgress = (id: string, progressInfo: any) => {
      const { loaded, total } = progressInfo;
      const percent = ((loaded / total) * 100).toFixed(2);
      setUploadProgress(`Progress: ${percent}%`);
    };

    // Error handler
    const errorHandler = (isRequestCancelled: any, file: File) => {
      return (error: any) => {
        if (!isRequestCancelled(error)) {
          console.error(`Upload failed: ${error.message}`);
          setUploadStatus(`Error: ${error.message}`);
        }
      };
    };

    try {
      const response: FileUploadResponse = await PCore.getAttachmentUtils().uploadAttachment(
        fileWithMetadata,
        onUploadProgress,
        errorHandler,
        'app/primary_1'
      );

      if (response) {
        setUploadStatus(`Uploaded: ${response.filename}`);
        console.log('Upload response:', response);
      }
    } catch (error: any) {
      console.error('Unexpected upload error:', error);
      setUploadStatus(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>

      {uploadProgress && <p>{uploadProgress}</p>}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
