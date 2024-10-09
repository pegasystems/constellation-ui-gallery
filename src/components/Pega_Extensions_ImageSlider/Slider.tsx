
import React, { useState, useEffect, useCallback } from 'react';
import { SliderContainer, SliderWrapper } from './styles';
import SlideItem from './SlideItem';
import SliderControls from './SliderControls';
import DotsNavigation from './DotsNavigation';

type PegaSliderProps = {
  imageData: { source: any };
  height?: string;
  animationType?: string;
  controlType?: any;
  autoplay?: string; // New prop for autoplay
  autoplayDuration?: number;
  objectFit?: string;
  textPosition?: string;
};

const PegaSlider: React.FC<PegaSliderProps> = ({
  imageData,
  height,
  controlType,
  autoplay,
  autoplayDuration = 3000,
  objectFit,
  textPosition = 'TopLeft',
  animationType = 'fade-in',
}) => {
  const imageSliderData = imageData?.source || [];

// eslint-disable-next-line no-console
console.log(imageSliderData, 'imageSliderData DX page')


  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [animationClass, setAnimationClass] = useState<string>(animationType);

  const totalSlides = imageSliderData.length;

  const showSlide = useCallback(
    (index: number) => {
      setAnimationClass(animationType); // Start fade-out animation
      setTimeout(() => {
        setCurrentSlide((index + totalSlides) % totalSlides); // Change the slide after animation
        setAnimationClass(animationType); // Reset to fade-in animation
      }, 500); // Match this duration with your CSS animation duration
    },
    [animationType, totalSlides]
  );

  const prevSlide = () => showSlide(currentSlide - 1);
  const nextSlide = useCallback(() => {
    showSlide(currentSlide + 1);
  }, [currentSlide, showSlide]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay === 'true' && totalSlides > 1) {
      const autoplayTimer = setInterval(() => {
        nextSlide();
      }, autoplayDuration);

      return () => clearInterval(autoplayTimer);
    }
  }, [autoplay, totalSlides, nextSlide, autoplayDuration]);

  return (
    <SliderContainer style={{ height }}>
      <SliderWrapper totalSlides={totalSlides} currentSlide={currentSlide}>
        {imageSliderData.map(
          (slide: {
            id: string | null | undefined;
            title: React.ReactNode;
            description: React.ReactNode;
            imageURL: string | undefined;
          }) => (
            <SlideItem
              key={slide.id || Math.random()}  // Ensure unique key for SlideItem
              slide={slide}
              animationClass={animationClass}
              isActive={currentSlide === parseInt(slide.id as string, 10)}
              objectFit={objectFit}
              textPosition={textPosition}
            />
          )
        )}
      </SliderWrapper>

      {(controlType === 'Buttons' || controlType === 'Both') && (
        <SliderControls prevSlide={prevSlide} nextSlide={nextSlide} />
      )}

      {(controlType === 'Dots' || controlType === 'Both') && (
        <DotsNavigation
          imageSliderData={imageSliderData}  // Pass imageSliderData here
          currentSlide={currentSlide}
          showSlide={showSlide}
        />
      )}
    </SliderContainer>
  );
};

export default PegaSlider;
