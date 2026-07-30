import React from 'react';
import { Dot, DotsContainer } from './styles';

type DotsNavigationProps = {
  imageSliderData: { id: string | number | null | undefined; imageURL?: string; title?: string }[];
  currentSlide: number;
  showSlide: (index: number) => void;
};

const DotsNavigation: React.FC<DotsNavigationProps> = ({ imageSliderData, currentSlide, showSlide }) => (
  <DotsContainer>
    {imageSliderData.map((slide, index) => (
      <Dot
        key={slide.id ?? slide.imageURL ?? slide.title}
        onClick={() => showSlide(index)}
        active={currentSlide === index}
      />
    ))}
  </DotsContainer>
);

export default DotsNavigation;
