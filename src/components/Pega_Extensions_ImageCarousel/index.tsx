import { withConfiguration } from '@pega/cosmos-react-core';

import type { PConnFieldProps } from './PConnProps';

import StyledPegaExtensionsPegaSliderWrapper from './styles';
import PegaSlider from './Slider';

// interface for props
interface PegaExtensionsPegaSliderProps extends PConnFieldProps {
  // eslint-disable-next-line react/no-unused-prop-types
  imageData: any;
  datasource: { source: [] };
  height?: string;
  controlType?: any;
  autoplay?: any;
  autoplayDuration?: any;
  objectFit?: any;
  textPosition?: any;
  animationType?: any;
}

function PegaExtensionsPegaSlider(props: PegaExtensionsPegaSliderProps) {
  // eslint-disable-next-line no-console
  console.log(props, 'index page props Image Carousel ');
  // eslint-disable-next-line no-console
  console.log(props.datasource, 'i am pega datasource Image Carousel data');

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPConnect,
    height = '30rem',
    datasource,
    controlType,
    autoplay,
    autoplayDuration,
    objectFit,
    textPosition,
    animationType
  } = props;

  return (
    <StyledPegaExtensionsPegaSliderWrapper>
      <PegaSlider imageData={datasource}  height={height} autoplayDuration={parseInt(autoplayDuration, 10)} animationType={animationType} textPosition={textPosition} controlType={controlType} autoplay={autoplay} objectFit={objectFit}/>
    </StyledPegaExtensionsPegaSliderWrapper>
  );
}
export default withConfiguration(PegaExtensionsPegaSlider);
