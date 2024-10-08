import React from 'react';
import { Dot, DotsContainer } from './styles';

type DotsNavigationProps = {
  imageSliderData: { id: string | number | null | undefined }[];  // Add the id type
  currentSlide: number;
  showSlide: (index: number) => void;
};

const DotsNavigation: React.FC<DotsNavigationProps> = ({
  imageSliderData,  // Receive image slider data to get ids
  currentSlide,
  showSlide,
}) => (
  <DotsContainer>
    {imageSliderData.map((slide, index) => (
      <Dot
        key={slide.id ? slide.id : `dot-${index}`} // Use unique slide id or fallback to index if no id
        onClick={() => showSlide(index)}
        active={currentSlide === index}
      />
    ))}
  </DotsContainer>
);

export default DotsNavigation;
