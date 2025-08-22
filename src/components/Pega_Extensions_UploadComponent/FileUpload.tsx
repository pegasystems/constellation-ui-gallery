// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect } from 'react';

type FileUploadResponse = {
  ID: string;
  category: string;
  clientFileID: string;
  filename: string;
  type: string;
};

interface FileUploadProps {
  context: any;
}

const FileUpload: React.FC<FileUploadProps> = ({ context }) => {
  console.log(PCore);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [newImg, setnewImg] = useState('');

  const generateUniqueID = () => '_' + Math.random().toString(36).substr(2, 9);

  useEffect(async () => {
    const path = `DATA-CONTENT-IMAGE a4de2bce-fcd5-4918-80eb-64d2742c8bb8`;

    PCore.getAttachmentUtils().downloadAttachment('DATA-WORKATTACH-FILE-TEMP BA7AB28F-FDDF-43E8-8947-54EAED0229A4!1', context)
    .then((res) => {
      console.log('file downloadAttachment');
      console.log(res);

      // setnewImg(res.data);

      const base64Data = res.data;
      const contentType = res.headers['content-type'] || 'image/png'; // Default to PNG if not provided

      // Create the image element
      const img = document.createElement('img');
      img.src = `data:${contentType};base64,${base64Data}`;

      // Optionally style the image
      img.style.maxWidth = '100%';
      img.style.height = 'auto';

      // Append the image to the DOM
      document.body.appendChild(img);

    }).catch(err => {
      console.log(e);
    });

    PCore.getAssetLoader().getSvcImageUrl('DATA-WORKATTACH-FILE-TEMP BA7AB28F-FDDF-43E8-8947-54EAED0229A4!1')
      .then((url) => {
        console.log('file Upload getSvcImageUrl');
        console.log(url);
      })
      .catch((e) => {
        console.log(e);
      });

      const constellationServiceUrl = await PCore.getAssetLoader().getConstellationServiceUrl();
      console.log(constellationServiceUrl);

  });


  const onUploadProgress = (id: string, progressInfo: any) => {
    console.log(id);
    console.log(progressInfo);
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

  async function handleFileChange(event) {
    const file = event.target.files[0]; // This is a real File object

    file.ID = generateUniqueID();
    console.log(file);
    const res = await PCore.getAttachmentUtils().uploadAttachment(
      file,
      onUploadProgress,
      errorHandler,
      'app/primary_1'
    );
    console.log(res);

    const { invokeCustomRestApi } = PCore.getRestClient();

    // /api/dev/v1/insights
    // https://8fhf5heb.pegace.net/prweb/PRAuth/app/dpms/api/application/v2/attachments/upload

    console.log(file.ID);

    invokeCustomRestApi('/api/application/v2/attachments/', {
       method: 'GET',
       body: {},
       headers: {},
       withoutDefaultHeaders : false
    }, context)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });

    invokeCustomRestApi(`/api/application/v2/attachments/${res.clientFileID}`, {
       method: 'GET',
       body: {},
       headers: {},
       withoutDefaultHeaders : false
    }, context)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });

    invokeCustomRestApi(`/api/application/v2/attachments/${res.ID}`, {
       method: 'GET',
       body: {},
       headers: {},
       withoutDefaultHeaders : false
    }, context)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });

    // {"ID":"394b3649-5306-4db8-b28d-516c28d5b58a"}
  }

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
      <img src='blob:https://8fhf5heb.pegace.net/b8d31e98-8549-453f-9d14-ea7279e298f0' />
      <img src={ newImg } />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>
        Upload
      </button>

      {uploadProgress && <p>{uploadProgress}</p>}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
