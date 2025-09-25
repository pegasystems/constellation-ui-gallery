import { withConfiguration } from '@pega/cosmos-react-core';
import { useState, useEffect, useCallback } from 'react';
import { SliderContainer, SliderWrapper } from './styles';
import SlideItem from './SlideItem';
import SliderControls from './Controls';
import DotsNavigation from './DotsNavigation';

// interface for props
export interface ImageCarouselProps {
  /** Name of the data page that will be called to get the Images */
  datasource: { source: any };
  /** Minimum height of the Carousel
   * @default 30rem
   */
  height: string;
  /** Type of animation for transitions between Carousel items
   * @default fade-in
   */
  animationType: 'fade-in' | 'fade-out' | 'slide-in' | 'slide-out' | 'zoom-in' | 'zoom-out' | 'bounce' | 'shake';
  /** Type of navigation controls for the Carousel
    - None: No navigation controls displayed.
    - Button: Includes next/previous buttons for manual navigation.
    - Dots: Displays dot indicators representing each item in the Carousel.
    - Both: Combines buttons and dot indicators for versatile navigation.

   * @default Dots
   */
  controlType: 'None' | 'Dots' | 'Buttons' | 'Both';
  /** Enable or disable autoplay functionality:
      - true: Automatically cycles through items at a set interval.
      - false: Requires manual navigation to view items.
   * @default true
   */
  autoplay?: boolean;
  /** Set the duration (in milliseconds) for how long each item is displayed before transitioning to the next one during autoplay.
   * @default 3000
   */
  autoplayDuration?: number;
  /** Object Fit Options
   - Fill: Stretches the image to fill the entire Carousel area.
   - Contain: Scales the image to fit within the Carousel while maintaining its aspect ratio.
   - Cover: Scales the image to cover the entire Carousel, cropping as needed to maintain the aspect ratio.
   - None: Displays the image in its original size, without scaling.
   - Scale Down: Scales the image down to fit within the Carousel only if it exceeds its original dimensions.
   * @default cover
   */
  objectFit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  /** Text Positioning Options
   * @default TopLeft
   */
  textPosition:
    | 'TopLeft'
    | 'TopCenter'
    | 'TopRight'
    | 'CenterLeft'
    | 'Center'
    | 'CenterRight'
    | 'BottomLeft'
    | 'BottomCenter'
    | 'BottomRight';

  getPConnect: () => any;
}

export const PegaExtensionsImageCarousel = (props: ImageCarouselProps) => {
  const {
    datasource,
    height = '30rem',
    controlType = 'Dots',
    autoplay = true,
    autoplayDuration = 3000,
    objectFit = 'cover',
    textPosition = 'TopLeft',
    animationType = 'fade-in',
    getPConnect,
  } = props;
  const imageSliderData = datasource?.source || [];

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
    [animationType, totalSlides],
  );

  const prevSlide = () => showSlide(currentSlide - 1);
  const nextSlide = useCallback(() => {
    showSlide(currentSlide + 1);
  }, [currentSlide, showSlide]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && totalSlides > 1) {
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
            title: string;
            description: string;
            imageURL: string | undefined;
          }) => (
            <SlideItem
              key={slide.id || Math.random()} // Ensure unique key for SlideItem
              slide={slide}
              animationClass={animationClass}
              isActive={currentSlide === parseInt(slide.id as string, 10)}
              objectFit={objectFit}
              textPosition={textPosition}
            />
          ),
        )}
      </SliderWrapper>

      {(controlType === 'Buttons' || controlType === 'Both') && (
        <SliderControls prevSlide={prevSlide} nextSlide={nextSlide} getPConnect={getPConnect} />
      )}

      {(controlType === 'Dots' || controlType === 'Both') && (
        <DotsNavigation
          imageSliderData={imageSliderData} // Pass imageSliderData here
          currentSlide={currentSlide}
          showSlide={showSlide}
        />
      )}
    </SliderContainer>
  );
};

export default withConfiguration(PegaExtensionsImageCarousel);
