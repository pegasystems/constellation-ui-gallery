import React from 'react';
import { ButtonPrev, ButtonNext } from './styles';

type SliderControlsProps = {
  prevSlide: () => void;
  nextSlide: () => void;
  getPConnect: () => any;
};

const SliderControls: React.FC<SliderControlsProps> = ({ prevSlide, nextSlide, getPConnect }) => (
  <>
    <ButtonPrev onClick={prevSlide} aria-label={getPConnect().getLocalizedValue('Previous slide')}>
      &#10094;
    </ButtonPrev>
    <ButtonNext onClick={nextSlide} aria-label={getPConnect().getLocalizedValue('Next slide')}>
      &#10095;
    </ButtonNext>
  </>
);

export default SliderControls;
