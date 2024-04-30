import StyledPegaExtensionsImageMagnifyTSWrapper from './styles';
import {
  MOUSE_ACTIVATION,
  SideBySideMagnifier,
  MagnifierContainer,
  MagnifierPreview,
  MagnifierZoom
} from 'react-image-magnifiers';

interface PegaExtensionsImageMagnifyTSProps {
  value: string;
  magnifyMode?: string;
  fillAvailableSpace?: boolean;
  fillGapLeft?: number;
  fillGapRight?: number;
  fillGapTop?: number;
  fillGapBottom?: number;
  fillAlignTop?: boolean;
  alwaysInPlace?: boolean;
  switchSides?: boolean;
  widthSel?: string;
  customWidth?: number;
  altText?: string;
  altTextOfImage?: string;
  propaltTextOfImage?: string;
  magnifyTrigger?: string;
  zoomTop?: number;
  zoomLeft?: number;
  zoomHeight?: number;
  zoomWidth?: number;
  previewRightOffset?: number;
  zoomZIndex?: number;
}

const PegaExtensionsImageMagnifyTS = (props: PegaExtensionsImageMagnifyTSProps) => {
  const {
    value,
    magnifyMode,
    fillAvailableSpace,
    fillGapLeft,
    fillGapRight,
    fillGapTop,
    fillGapBottom,
    fillAlignTop,
    alwaysInPlace,
    switchSides,
    widthSel,
    customWidth,
    altText,
    altTextOfImage,
    propaltTextOfImage,
    magnifyTrigger,
    zoomTop,
    zoomLeft,
    zoomHeight,
    zoomWidth,
    previewRightOffset,
    zoomZIndex
  } = props;

  // @ts-ignore
  let magTrigger = MOUSE_ACTIVATION.HOVER;
  if (magnifyTrigger === 'magTriggerClick') {
    magTrigger = MOUSE_ACTIVATION.CLICK;
  } else if (magnifyTrigger === 'magTriggerDoubleClick') {
    magTrigger = MOUSE_ACTIVATION.DOUBLE_CLICK;
  }

  const magnifierContent =
    magnifyMode === 'magAdvanced' ? (
      <MagnifierContainer>
        <MagnifierPreview
          imageSrc={value}
          // @ts-ignore
          mouseActivation={magTrigger}
          style={{
            ...(widthSel === 'widthpx' && { width: customWidth }),
            position: 'relative',
            right: previewRightOffset
          }}
        />
        <MagnifierZoom
          style={{
            height: `${zoomHeight}%`,
            width: zoomWidth,
            position: 'absolute',
            left: zoomLeft,
            top: zoomTop,
            zIndex: zoomZIndex
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
    );

  return (
    <StyledPegaExtensionsImageMagnifyTSWrapper>
      {magnifierContent}
    </StyledPegaExtensionsImageMagnifyTSWrapper>
  );
};

PegaExtensionsImageMagnifyTS.defaultProps = {
  widthSel: 'defaultWidth',
  customWidth: null,
  altText: 'constant',
  altTextOfImage: '',
  propaltTextOfImage: '',
  fillAvailableSpace: false,
  fillAlignTop: false,
  fillGapLeft: 0,
  fillGapRight: 0,
  fillGapTop: 0,
  fillGapBottom: 0,
  switchSides: false,
  alwaysInPlace: false,
  zoomTop: 0,
  zoomLeft: 0,
  zoomHeight: 100,
  zoomWidth: 300,
  previewRightOffset: 0,
  zoomZIndex: 999
};

export default PegaExtensionsImageMagnifyTS;
