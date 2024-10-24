// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';
import { keyframes } from 'styled-components';

export const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

export const SliderWrapper = styled.div<{ totalSlides: number; currentSlide: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${props => props.currentSlide * 100}%);
  width: 100%;
  height: 100%;
`;

export const SlideImage = styled.img<{ objectFit?: string }>`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  object-position: center;
`;

export const ButtonPrev = styled.button`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #fff;
  z-index: 10;
`;

export const ButtonNext = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #fff;
  z-index: 10;
`;

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  z-index: 9999;
  position: relative;
  top: -20px;
`;

export const Dot = styled.a<{ active: boolean }>`
  background-color: ${props => (props.active ? '#285aa8' : '#b1b1b1')};
  border: none;
  border-radius: 50%;
  height: 12px;
  width: 12px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6293df;
  }
`;

export const SliderTextContainer = styled.div<{ position: string }>`
  position: absolute;
  width: 50%;
  ${({ position }) => {
    switch (position) {
      case 'TopCenter':
        return css`
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        `;
      case 'TopRight':
        return css`
          top: 20px;
          right: 50px;
          text-align: right;
        `;
      case 'CenterLeft':
        return css`
          top: 50%;
          left: 50px;
          transform: translateY(-50%);
          text-align: left;
        `;
      case 'Center':
        return css`
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        `;
      case 'CenterRight':
        return css`
          top: 50%;
          right: 50px;
          transform: translateY(-50%);
          text-align: right;
        `;
      case 'BottomLeft':
        return css`
          bottom: 20px;
          left: 50px;
          text-align: left;
        `;
      case 'BottomCenter':
        return css`
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        `;
      case 'BottomRight':
        return css`
          bottom: 20px;
          right: 50px;
          text-align: right;
        `;
      case 'TopLeft':
      default:
        return css`
          top: 20px;
          left: 50px;
          text-align: left;
        `;
    }
  }}
`;

// Fade In and Out
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
  70% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
`;

// Slide In and Out
export const slideIn = keyframes`
  0% {
    transform: translateX(0);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-100%);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideOut = keyframes`
 0% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-100%);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Zoom In and Out
export const zoomIn = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
`;

export const zoomOut = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
`;

// Shake Animation
export const shake = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-20px);
  }
  50% {
    transform: translateX(20px);
  }
  75% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0);
  }
`;

// Bounce Animation
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

// Rotate Clockwise and Counter Clockwise (optional)
export const rotateClockwise = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const rotateCounterClockwise = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

export const Slide = styled.div<{ animationClass: string }>`
  min-width: 100%;
  opacity: 1;
  height: 100%;
  position: relative;
  animation: ${({ animationClass }) => {
    switch (animationClass) {
      case 'fade-out':
        return css`
          ${fadeOut} 0.5s forwards
        `;
      case 'slide-in':
        return css`
          ${slideIn} 0.5s forwards
        `;
      case 'slide-out':
        return css`
          ${slideOut} 0.5s forwards
        `;
      case 'zoom-in':
        return css`
          ${zoomIn} 0.5s forwards
        `;
      case 'zoom-out':
        return css`
          ${zoomOut} 0.5s forwards
        `;
      case 'shake':
        return css`
          ${shake} 0.5s forwards
        `;
      case 'bounce':
        return css`
          ${bounce} 0.5s forwards
        `;
      case 'fade-in':
      default:
        return css`
          ${fadeIn} 0.5s forwards
        `;
    }
  }};
`;
