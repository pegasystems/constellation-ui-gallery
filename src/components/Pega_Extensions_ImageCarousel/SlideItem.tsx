import React from 'react';
import { Slide, SlideImage, SliderTextContainer } from './styles';

type SlideItemProps = {
  slide: {
    title: string;
    description: string;
    imageURL: string | undefined;
  };
  animationClass: string;
  isActive: boolean;
  objectFit?: string;
  textPosition?: string;
};

const SlideItem: React.FC<SlideItemProps> = ({
  slide,
  animationClass,
  isActive,
  objectFit,
  textPosition = 'Center',
}) => {
  return (
    <Slide animationClass={animationClass} style={{ display: isActive ? 'block' : '' }}>
      <SliderTextContainer position={textPosition}>
        <h2 title='This is image slide title'>{slide.title}</h2>
        <p>{slide.description}</p>
      </SliderTextContainer>
      <SlideImage src={slide.imageURL} alt={`Slide ${slide.title}`} objectFit={objectFit} />
    </Slide>
  );
};

export default SlideItem;
