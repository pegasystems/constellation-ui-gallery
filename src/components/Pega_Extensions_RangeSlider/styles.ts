import { mix } from 'polished';
import { tryCatch, defaultThemeProp, useDirection } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyledRangeSliderWrapper = styled.div(() => {
  return css`
    padding: 0 1.5rem;
  `;
});

export const StyledThumb = styled.div(
  ({
    theme: {
      base: {
        palette: { 'primary-background': bgColor, 'border-line': borderColor, interactive: fgColor },
        spacing,
        'border-radius': borderRadius,
      },
      components: { button },
    },
  }) => {
    const hoverBgColor = tryCatch(() => mix(0.2, fgColor, bgColor));

    return css`
      border: ${button['border-width']} solid ${borderColor};
      border-radius: calc(${borderRadius} * 3);
      outline: none;
      background-color: ${bgColor};
      width: calc(${spacing} * 3);
      height: calc(${spacing} * 3);
      cursor: pointer;

      &:focus {
        box-shadow: ${button['focus-shadow']};
      }

      &:hover,
      &:active {
        background-color: ${hoverBgColor};
        border-color: ${fgColor};
      }
    `;
  },
);

StyledThumb.defaultProps = defaultThemeProp;

export const StyledBar = styled.div(({ theme }) => {
  const {
    base: {
      spacing,
      colors,
      'border-radius': borderRadius,
      palette: { interactive: interactiveColor },
    },
  } = theme;

  const { ltr } = useDirection();

  return css`
    border-radius: ${borderRadius};
    height: ${spacing};
    width: 100%;
    top: calc(2rem + ${spacing} * 2 - ${spacing} / 2);
    overflow: hidden;
    position: relative;
    background-color: ${colors.gray.light};

    ::before {
      position: absolute;
      top: 0;
      content: '';
      display: block;
      height: 100%;
      width: calc(var(--max-slider-value) - var(--min-slider-value));
      background-color: ${interactiveColor};
      ${ltr
        ? css`
            left: var(--min-slider-value);
          `
        : css`
            right: var(--min-slider-value);
          `}
    }
  `;
});

StyledBar.defaultProps = defaultThemeProp;

export const StyledMinTrack = styled.div(
  ({
    theme: {
      base: { spacing },
    },
  }) => {
    const { ltr } = useDirection();
    return css`
      height: calc(${spacing} * 4);
      width: 100%;
      cursor: pointer;
      position: absolute;
      left: 0;
      right: 0;
      top: 2rem;

      > ${StyledThumb} {
        z-index: 1;
        position: absolute;
        top: calc(${spacing} / 2);
        left: var(--min-slider-value);
        right: var(--min-slider-value);
        ${ltr
          ? css`
              transform: translate(-50%, 0);
            `
          : css`
              transform: translate(50%, 0);
            `}
      }
    `;
  },
);

StyledMinTrack.defaultProps = defaultThemeProp;

export const StyledMaxTrack = styled.div(
  ({
    theme: {
      base: { spacing },
    },
  }) => {
    const { ltr } = useDirection();
    return css`
      height: calc(${spacing} * 4);
      width: 100%;
      cursor: pointer;
      position: absolute;
      left: 0;
      right: 0;
      top: 2rem;

      > ${StyledThumb} {
        z-index: 1;
        position: absolute;
        top: calc(${spacing} / 2);
        left: var(--max-slider-value);
        right: var(--max-slider-value);
        ${ltr
          ? css`
              transform: translate(-50%, 0);
            `
          : css`
              transform: translate(50%, 0);
            `}
      }
    `;
  },
);

StyledMaxTrack.defaultProps = defaultThemeProp;

export const StyledSlider = styled.div((props) => {
  const {
    theme: {
      base: { spacing },
    },
  } = props;

  return css`
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    height: calc(2rem + ${spacing} * 4);
    > span {
      line-height: calc(${spacing} * 4);
    }
  `;
});

StyledSlider.defaultProps = defaultThemeProp;

export const StyledMinValue = styled.div(({ theme }) => {
  const {
    base: {
      palette: { interactive: interactiveColor },
    },
  } = theme;
  const { ltr } = useDirection();
  return css`
    position: absolute;
    min-width: 1.5rem;
    ${ltr
      ? css`
          left: calc(var(--min-slider-value) - 2.5rem);
          right: auto;
        `
      : css`
          right: calc(var(--min-slider-value) - 2.5rem);
          left: auto;
        `}
    top: 0;
    width: 5rem;
    display: flex;
    flex-flow: row;
    justify-content: center;

    & > span {
      background-color: ${interactiveColor};
      color: #ffffff;
      border-radius: 1rem;
      height: 1.5rem;
      line-height: 1.5rem;
      min-width: 1.5rem;
      padding: 0 0.25rem;
    }
    & > span::before {
      border-left: 0.375rem solid transparent;
      border-right: 0.375rem solid transparent;
      border-top: 0.375rem solid ${interactiveColor};
      bottom: -0.3125rem;
      content: '';
      height: 0;
      left: 50%;
      position: absolute;
      right: 50%;
      ${ltr
        ? css`
            transform: translateX(-50%);
          `
        : css`
            transform: translateX(50%);
          `}
      width: 0;
    }
    & > span::after {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border: 0.0625rem solid transparent;
      border-radius: inherit;
      content: '';
      pointer-events: none;
    }
  `;
});

StyledMinValue.defaultProps = defaultThemeProp;

export const StyledMaxValue = styled.div(({ theme }) => {
  const {
    base: {
      palette: { interactive: interactiveColor },
    },
  } = theme;
  const { ltr } = useDirection();
  return css`
    position: absolute;
    min-width: 1.5rem;
    ${ltr
      ? css`
          left: calc(var(--max-slider-value) - 2.5rem);
          right: auto;
        `
      : css`
          right: calc(var(--max-slider-value) - 2.5rem);
          left: auto;
        `}
    top: 0;
    width: 5rem;
    display: flex;
    flex-flow: row;
    justify-content: center;
    & > span {
      background-color: ${interactiveColor};
      color: #ffffff;
      border-radius: 1rem;
      height: 1.5rem;
      line-height: 1.5rem;
      min-width: 1.5rem;
      padding: 0 0.25rem;
    }
    & > span::before {
      border-left: 0.375rem solid transparent;
      border-right: 0.375rem solid transparent;
      border-top: 0.375rem solid ${interactiveColor};
      bottom: -0.3125rem;
      content: '';
      height: 0;
      left: 50%;
      position: absolute;
      right: 50%;
      ${ltr
        ? css`
            transform: translateX(-50%);
          `
        : css`
            transform: translateX(50%);
          `}
      width: 0;
    }
    & > span::after {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border: 0.0625rem solid transparent;
      border-radius: inherit;
      content: '';
      pointer-events: none;
    }
  `;
});

StyledMaxValue.defaultProps = defaultThemeProp;
