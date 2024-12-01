import { withConfiguration } from '@pega/cosmos-react-core';
import '../create-nonce';
import { useEffect, useRef, useState } from 'react';

type IframeWrapperProps = {
  /** Title of the iframe - required for accessibility */
  title: string;
  /** URL set on the iframe */
  value: string;
  /** Height mode
   * @default fixed
   */
  heightMode: 'auto' | 'fixed';
  /** Height in px - only used if heightMode is set to 'fixed'
   * @default 500
   */
  height?: number;
};

export const PegaExtensionsIframeWrapper = (props: IframeWrapperProps) => {
  const { title = 'iFrame title', value, heightMode = 'fixed', height = 500 } = props;
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef?.current && heightMode === 'auto') {
      const iframe = iframeRef.current;
      const handleResize = (message: any) => {
        if (message.data.type === 'resize') {
          setDynamicHeight(message.data.height + 6);
        }
      };

      if (iframe) {
        window.addEventListener('message', handleResize);

        return () => {
          window.removeEventListener('load', handleResize);
        };
      }
    }
  }, [heightMode]);

  if (heightMode === 'fixed' && height) {
    return (
      <iframe
        src={value}
        title={title}
        allow="geolocation 'self' *"
        width='100%'
        height={height}
        style={{ border: 'none' }}
      />
    );
  }
  return (
    <iframe
      ref={iframeRef}
      src={value}
      title={title}
      width='100%'
      height={dynamicHeight}
      allow="geolocation 'self' *"
      style={{ border: 'none', overflowY: 'hidden' }}
    />
  );
};
export default withConfiguration(PegaExtensionsIframeWrapper);
