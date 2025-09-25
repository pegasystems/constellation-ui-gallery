import { withConfiguration } from '@pega/cosmos-react-core';
import {
  MOUSE_ACTIVATION,
  SideBySideMagnifier,
  MagnifierContainer,
  MagnifierPreview,
  MagnifierZoom,
} from 'react-image-magnifiers';
import '../create-nonce';
import LightboxImage from './LightboxImage';

export type PegaExtensionsImageMagnifyProps = {
  value: string;

  /**
   * Width selection - if set to widthpx, you need to configure customWidth
   * @default defaultWidth
   */
  widthSel?: 'defaultWidth' | 'widthpx';
  /**
   * customWidth (in px) - only used if  widthSel = widthpx
   * @default 100
   */
  customWidth?: number;
  /**
   * maxHeight - only used if  widthSel = widthpx and magnifyMode='lightbox'
   * @default 100px
   */
  customHeight?: string;

  /**
   * Configuration for the image alt text
   * @default constant
   */
  altText?: 'constant' | 'propertyRef';
  /**
   * Configure of the alt text if constant
   */
  altTextOfImage?: string;
  /**
   * Configure of the alt text if property ref
   */
  propaltTextOfImage?: string;

  /**
   * Magnifier trigger (hover, click or doubleclick)
   * @default magTriggerHover
   */
  magnifyTrigger?: 'magTriggerHover' | 'magTriggerClick' | 'magTriggerDoubleClick';

  /**
   * Magnifier mode
   * @default magSideBySide
   */
  magnifyMode?: 'magSideBySide' | 'magAdvanced' | 'lightbox';

  /**
   * Always magnify in place
   * @default false
   */
  alwaysInPlace?: boolean;
  /**
   * Show on left
   * @default false
   */
  switchSides?: boolean;
  /**
   * Fill available Space
   * @default false
   */
  fillAvailableSpace?: boolean;
  /**
   * Align to top
   * @default false
   */
  fillAlignTop?: boolean;
  /**
   * Gap left
   * @default 0
   */
  fillGapLeft?: number;
  /**
   * Gap Right
   * @default 0
   */
  fillGapRight?: number;
  /**
   * Gap Top
   * @default 0
   */
  fillGapTop?: number;
  /**
   * Gap Bottom
   * @default 0
   */
  fillGapBottom?: number;

  /**
   * Zoom top position (px)
   * @default 0
   */
  zoomTop?: number;
  /**
   * Zoom left position (px)
   * @default 0
   */
  zoomLeft?: number;
  /**
   * Zoom display height (%)
   * @default 100
   */
  zoomHeight?: number;
  /**
   * Zoom display width (px)
   * @default 300
   */
  zoomWidth?: number;

  /**
   * Preview image right offset (px)
   * @default 0
   */
  previewRightOffset?: number;
  /**
   * Zoom display z-index value
   * @default 999
   */
  zoomZIndex?: number;
};

export const PegaExtensionsImageMagnify = (props: PegaExtensionsImageMagnifyProps) => {
  const {
    value = '',
    magnifyMode = 'magSideBySide',
    magnifyTrigger = 'magTriggerHover',
    fillAvailableSpace = false,
    fillGapLeft = 0,
    fillGapRight = 0,
    fillGapTop = 0,
    fillGapBottom = 0,
    fillAlignTop = false,
    alwaysInPlace = false,
    switchSides = false,
    widthSel = 'defaultWidth',
    customWidth = 100,
    altText = 'constant',
    altTextOfImage = '',
    propaltTextOfImage = '',
    zoomTop = 0,
    zoomLeft = 0,
    zoomHeight = 100,
    zoomWidth = 300,
    previewRightOffset = 0,
    zoomZIndex = 999,
  } = props;

  if (!value) return null;
  if (magnifyMode === 'lightbox') {
    return <LightboxImage {...props} />;
  }

  // @ts-ignore
  let magTrigger = MOUSE_ACTIVATION.HOVER;
  if (magnifyTrigger === 'magTriggerClick') {
    magTrigger = MOUSE_ACTIVATION.CLICK;
  } else if (magnifyTrigger === 'magTriggerDoubleClick') {
    magTrigger = MOUSE_ACTIVATION.DOUBLE_CLICK;
  }
  return (
    <>
      {magnifyMode === 'magAdvanced' ? (
        <MagnifierContainer>
          <MagnifierPreview
            imageSrc={value}
            // @ts-ignore
            mouseActivation={magTrigger}
            style={{
              ...(widthSel === 'widthpx' && { width: customWidth }),
              position: 'relative',
              right: previewRightOffset,
            }}
          />
          <MagnifierZoom
            style={{
              height: `${zoomHeight}%`,
              width: zoomWidth,
              position: 'absolute',
              left: zoomLeft,
              top: zoomTop,
              zIndex: zoomZIndex,
            }}
            imageSrc={value}
          />
        </MagnifierContainer>
      ) : (
        <SideBySideMagnifier
          imageSrc={value}
          imageAlt={altText === 'propertyRef' ? propaltTextOfImage : altTextOfImage}
          style={widthSel === 'widthpx' ? { width: customWidth } : undefined}
          fillAvailableSpace={fillAvailableSpace}
          fillAlignTop={fillAlignTop}
          fillGapLeft={fillGapLeft}
          fillGapRight={fillGapRight}
          fillGapTop={fillGapTop}
          fillGapBottom={fillGapBottom}
          alwaysInPlace={alwaysInPlace}
          switchSides={switchSides}
          // @ts-ignore
          mouseActivation={magTrigger}
        />
      )}
    </>
  );
};

export default withConfiguration(PegaExtensionsImageMagnify);
