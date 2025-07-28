import { Button, Lightbox, registerIcon, type LightboxItem } from '@pega/cosmos-react-core';
import { useRef, useState, useEffect } from 'react';
import type { PegaExtensionsImageMagnifyProps } from '.';
import * as downloadIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/download.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';
import styled from 'styled-components';

registerIcon(downloadIcon, timesIcon);

const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);

const styledButton = styled.button`
  width: 100%;
  text-align: center;
`;

const LightboxImage = (props: PegaExtensionsImageMagnifyProps) => {
  const { value, customHeight = '100px', customWidth = 40, altText, altTextOfImage, propaltTextOfImage } = props;
  const demoButtonRef = useRef<HTMLButtonElement>(null);
  let imageDisplayComp = null;
  const [images, setImages] = useState<Array<LightboxItem>>([]);
  const [subType, setSubType] = useState('');

  useEffect(() => {
    fetch(value)
      .then((response) => {
        if (response.ok) {
          const contentType = response?.headers?.get('content-type') || '';
          setSubType(contentType?.split('/')[1]);
        }
      })
      .catch(() => {
        setSubType('');
      });
  }, [value]);

  const onClick = () => {
    const imgDescription = {
      id: 'url',
      name: (altText === 'propertyRef' ? propaltTextOfImage : altTextOfImage) || 'Image',
      description: '',
      src: value,
      format: subType,
      error: subType === undefined,
    };
    setImages([imgDescription]);
  };

  const onItemDownload = async (id: string) => {
    const a = document.createElement('a');
    if (images[0].src) {
      a.href = await fetch(images[0].src)
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          return URL.createObjectURL(blob);
        });
    }
    a.download = images?.find((image) => image.id === id)?.name ?? id;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onItemError = (id: string) => {
    setImages((item) => {
      return item?.map((obj) => (obj.id === id ? { ...obj, error: true } : obj));
    });
  };

  imageDisplayComp = (
    <>
      <Button ref={demoButtonRef} variant='link' compact={false} onClick={onClick} autoFocus as={styledButton}>
        <img
          src={value}
          alt={altText === 'constant' ? altTextOfImage : propaltTextOfImage}
          style={{ maxWidth: `${customWidth}px`, maxHeight: customHeight }}
        />
      </Button>

      {images?.length > 0 && (
        <Lightbox
          items={images}
          cycle={false}
          onAfterClose={() => {
            setImages([]);
            demoButtonRef.current?.focus();
          }}
          onItemDownload={images[0].src && isImage(images[0].src) ? onItemDownload : undefined}
          onItemError={onItemError}
        />
      )}
    </>
  );
  return imageDisplayComp;
};

export default LightboxImage;
