import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, Flex, Button, Input, withConfiguration } from '@pega/cosmos-react-core';
import StyledPegaExtensionsCameraCaptureWrapper from './styles';
import '../shared/create-nonce';

type CameraComponentProps = {
  buttonText: string;
  getPConnect: any;
};

export const PegaExtensionsCameraCapture = (props: CameraComponentProps) => {
  const { getPConnect, buttonText } = props;

  const [attachmentFieldName, setAttachmentFieldName] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  type MessageVariant = 'success' | 'error';

  const [messageState, setMessageState] = useState<{
    visible: boolean;
    message: string;
    variant: MessageVariant;
  }>({
    visible: false,
    message: '',
    variant: 'success',
  });

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoDims, setVideoDims] = useState<{ width: number; height: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const pConn = getPConnect();
  const context = pConn.getContextName();

  const IMAGE_MIME = 'image/png';

  const caseInfo = useMemo(() => {
    return pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO) || {};
  }, [pConn]);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
    setAttachmentFieldName(`image_${formatted}`);
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (cameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Video play error (may be autoplay blocked):', err);
      });
    }
  }, [cameraActive, stream]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (Math.round(cr.width) !== containerWidth) {
          setContainerWidth(Math.round(cr.width));
        }
      }
    });

    ro.observe(el);
    setContainerWidth(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  const showMessage = (message: string, variant: MessageVariant = 'success') => {
    setMessageState({
      visible: true,
      message,
      variant,
    });

    setTimeout(() => {
      setMessageState((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCapturedImg(null);
      setStream(mediaStream);
      setCameraActive(true);
    } catch {
      showMessage('Camera access denied or unavailable.', 'error');
    }
  };

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCapturedImg(null);
    setCameraActive(false);
  }, [stream]);

  const stopCameraStream = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraActive(false);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) {
      const width = v.videoWidth;
      const height = v.videoHeight;
      if (width && height) {
        setVideoDims({ width, height });
      }
    }
  };

  const captureImage = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const videoWidth = videoElement.videoWidth || containerWidth;
    const videoHeight =
      videoElement.videoHeight ||
      (videoDims ? Math.round(videoWidth * (videoDims.height / videoDims.width)) : undefined);

    if (!videoWidth || !videoHeight) {
      console.error('Cannot determine natural video dimensions for capture', { videoWidth, videoHeight });
      return;
    }
    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;

    const canvasContext = canvasElement.getContext('2d');
    if (!canvasContext) {
      console.error('Cannot get canvas context');
      return;
    }
    canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const capturedImageData = canvasElement.toDataURL(IMAGE_MIME);

    setCapturedImg(capturedImageData);
    stopCameraStream();
  };

  const handleRetake = () => {
    setCapturedImg(null);
    startCamera();
  };

  const base64ToFile = (base64String: string, fileName: string) => {
    const [metadata, base64Data] = base64String.split(',');
    const mimeMatch = metadata.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : IMAGE_MIME;
    const binaryString = atob(base64Data);
    const byteLength = binaryString.length;
    const byteArray = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return new File([byteArray], fileName, { type: mimeType });
  };

  const onUploadProgress = (e: any) => {
    console.log(e);
  };

  const errorHandler = (isRequestCancelled: any) => {
    return (error: any) => {
      if (!isRequestCancelled(error)) {
        console.error(`Upload failed: ${error.message}`);
      }
    };
  };

  const linkFile = async (id: any, name: any) => {
    const file = {
      type: 'File',
      category: 'File',
      attachmentFieldName: 'File',
      fileType: 'PNG',
      name: name,
      ID: id,
    };

    await (window as any).PCore.getAttachmentUtils().linkAttachmentsToCase(caseInfo?.ID, [file], 'File', context);
    stopCamera();
  };

  const handleUpload = async () => {
    if (!capturedImg) return;

    const id = crypto.randomUUID();
    const fileName = `${attachmentFieldName || `camera_capture_${id}`}.png`;
    const file = base64ToFile(capturedImg, fileName);
    (file as any).ID = id;
    try {
      const res = await (window as any).PCore.getAttachmentUtils().uploadAttachment(
        file as any,
        onUploadProgress,
        errorHandler,
        context,
      );

      if (!res?.ID) {
        throw new Error('Upload failed');
      }

      await linkFile(res.ID, fileName);
      showMessage('Attachment added to case successfully', 'success');
    } catch {
      showMessage('Failed to upload attachment. Please try again.', 'error');
    }
  };

  return (
    <StyledPegaExtensionsCameraCaptureWrapper>
      {messageState.visible && (
        <div className={`custom-toast custom-toast--${messageState.variant}`} role='status' aria-live='polite'>
          {messageState.message}
        </div>
      )}
      <Card>
        <CardContent>
          <Flex container={{ direction: 'column', gap: 2 }}>
            {!cameraActive && !capturedImg && (
              <Flex container={{ gap: 2 }}>
                <Button variant='primary' onClick={startCamera} className='camera-buttons'>
                  {buttonText}
                </Button>
              </Flex>
            )}

            {cameraActive && !capturedImg && (
              <>
                <div ref={containerRef} className='camera-container'>
                  <video
                    className='camera-video'
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={handleLoadedMetadata}
                  />
                </div>
                <Flex container={{ gap: 2 }}>
                  <Button variant='primary' onClick={captureImage} className='camera-buttons'>
                    Capture
                  </Button>
                  <Button variant='primary' onClick={stopCamera} className='camera-buttons'>
                    Turn off Camera
                  </Button>
                </Flex>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            )}

            {capturedImg && (
              <>
                <div className='captured-wrapper'>
                  <img className='captured-image' src={capturedImg} alt='Captured' />
                </div>
                <Flex container={{}}>
                  <Input
                    value={attachmentFieldName}
                    type='text'
                    placeholder='Enter File Name (Optional)'
                    style={{ width: '200px' }}
                    onChange={(e) => {
                      setAttachmentFieldName(e.currentTarget.value);
                    }}
                  />
                  <div className='inputAddon'>.png</div>
                  <Button variant='primary' onClick={handleUpload} className='camera-buttons'>
                    Save as Attachment
                  </Button>
                  <Button variant='primary' onClick={handleRetake} className='camera-buttons'>
                    Retake
                  </Button>
                  <Button variant='primary' onClick={stopCamera} className='camera-buttons'>
                    Turn off Camera
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </CardContent>
      </Card>
    </StyledPegaExtensionsCameraCaptureWrapper>
  );
};

export default withConfiguration(PegaExtensionsCameraCapture);
