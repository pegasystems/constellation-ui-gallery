import React from 'react';
import { ButtonPrev, ButtonNext } from './styles';

type SliderControlsProps = {
  prevSlide: () => void;
  nextSlide: () => void;
};

const SliderControls: React.FC<SliderControlsProps> = ({ prevSlide, nextSlide }) => (
  <>
    <ButtonPrev onClick={prevSlide} aria-label="Previous Slide">
      &#10094;
    </ButtonPrev>
    <ButtonNext onClick={nextSlide} aria-label="Next Slide">
      &#10095;
    </ButtonNext>
  </>
);

export default SliderControls;
