import styled, { css, keyframes } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import { defaultThemeProp } from '@pega/cosmos-react-core';
import type { ProgressSize, ProgressTone } from './utils';

const lightSweep = keyframes`
  from {
    transform: translateX(-140%);
  }

  to {
    transform: translateX(520%);
  }
`;

const glowBreath = keyframes`
  0%,
  100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.12);
  }
`;

const completionFlash = keyframes`
  0% {
    filter: brightness(1);
    transform: scaleY(1);
  }

  35% {
    filter: brightness(1.3);
    transform: scaleY(1.35);
  }

  100% {
    filter: brightness(1);
    transform: scaleY(1);
  }
`;

const stripeDrift = keyframes`
  from {
    background-position: 0 0;
  }

  to {
    background-position: 1rem 1rem;
  }
`;

const getTrackHeight = (size: ProgressSize, spacing: string): string => {
  if (size === 'compact') {
    return `calc(${spacing} * 0.5)`;
  }

  if (size === 'large') {
    return `calc(${spacing} * 1.5)`;
  }

  return spacing;
};

const getToneColor = (tone: ProgressTone, theme: DefaultTheme): string => {
  const colors: Record<ProgressTone, string> = {
    accent: theme.base.palette.interactive,
    success: theme.base.palette.success,
    warning: theme.base.palette.warn,
    danger: theme.base.palette.urgent,
  };

  return colors[tone];
};

export const StyledProgressBar = styled.div(({ theme }) => {
  return css`
    display: flex;
    flex-direction: column;
    gap: ${theme.base.spacing};
    width: 100%;
  `;
});

StyledProgressBar.defaultProps = defaultThemeProp;

export const StyledProgressHeader = styled.div(({ theme }) => {
  return css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.base.spacing};
    min-height: calc(${theme.base.spacing} * 1.25);
  `;
});

StyledProgressHeader.defaultProps = defaultThemeProp;

export const StyledProgressValue = styled.span(({ theme }) => {
  return css`
    min-width: 3.5rem;
    padding: calc(${theme.base.spacing} * 0.375) calc(${theme.base.spacing} * 0.75);
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    border-radius: ${theme.base['border-radius']};
    background: ${theme.base.palette['secondary-background']};
    color: ${theme.base.palette['foreground-color']};
    font-size: ${theme.base['font-size']};
    font-weight: ${theme.base['font-weight']['semi-bold']};
    text-align: center;
  `;
});

StyledProgressValue.defaultProps = defaultThemeProp;

export const StyledProgressStatus = styled.span<{ $tone: ProgressTone }>(({ theme, $tone }) => {
  const toneColor = getToneColor($tone, theme);

  return css`
    display: inline-flex;
    align-items: center;
    gap: calc(${theme.base.spacing} * 0.5);
    color: ${theme.base.palette['foreground-color']};
    font-size: ${theme.base['font-size']};

    &::before {
      width: calc(${theme.base.spacing} * 0.625);
      height: calc(${theme.base.spacing} * 0.625);
      border-radius: 50%;
      background: ${toneColor};
      box-shadow: 0 0 calc(${theme.base.spacing} * 0.5) ${toneColor};
      content: '';
    }
  `;
});

StyledProgressStatus.defaultProps = defaultThemeProp;

export const StyledProgressRail = styled.div(({ theme }) => {
  return css`
    display: flex;
    flex-direction: column;
    gap: calc(${theme.base.spacing} * 0.5);
    width: 100%;
  `;
});

StyledProgressRail.defaultProps = defaultThemeProp;

export const StyledProgressTrack = styled.div<{ $size: ProgressSize }>(({ theme, $size }) => {
  return css`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: ${getTrackHeight($size, theme.base.spacing)};
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    border-radius: ${theme.base['border-radius']};
    background: ${theme.base.palette['secondary-background']};
    box-shadow: inset 0 0.125rem 0.25rem rgb(0 0 0 / 0.08);
  `;
});

StyledProgressTrack.defaultProps = defaultThemeProp;

export const StyledProgressMarkers = styled.div(() => {
  return css`
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  `;
});

StyledProgressMarkers.defaultProps = defaultThemeProp;

export const StyledProgressLegend = styled.div(({ theme }) => {
  return css`
    display: flex;
    justify-content: flex-end;
    color: ${theme.base.palette['foreground-color']};
    font-size: calc(${theme.base['font-size']} * 0.875);
    opacity: ${theme.base.transparency['transparent-2']};
  `;
});

StyledProgressLegend.defaultProps = defaultThemeProp;

export const StyledProgressMarker = styled.span<{ $active: boolean }>(({ theme, $active }) => {
  return css`
    position: absolute;
    inset-block: 0;
    width: 0.0625rem;
    background: ${theme.base.palette['primary-background']};
    opacity: ${$active ? 0.7 : 0.32};
    transform: translateX(-50%);
  `;
});

StyledProgressMarker.defaultProps = defaultThemeProp;

export const StyledProgressFill = styled.div<{
  $complete: boolean;
  $indeterminate: boolean;
  $percentage: number;
  $tone: ProgressTone;
}>(({ theme, $complete, $indeterminate, $percentage, $tone }) => {
  return css`
    position: relative;
    overflow: hidden;
    width: ${$indeterminate ? '100%' : `${$percentage}%`};
    height: 100%;
    border-radius: inherit;
    background: ${getToneColor($tone, theme)};
    box-shadow: 0 0 calc(${theme.base.spacing} * 0.75) ${getToneColor($tone, theme)};
    transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1);

    &::after {
      position: absolute;
      inset-block: 0;
      left: 0;
      width: 28%;
      background: ${theme.base.palette['primary-background']};
      content: '';
      opacity: 0.24;
      transform: translateX(-120%);
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: ${$complete ? completionFlash : glowBreath} ${$complete ? '900ms' : '2.8s'} ease-in-out
        ${$complete ? '1' : 'infinite'};

      &::after {
        animation: ${lightSweep} ${$indeterminate ? '1.6s' : '2.6s'} cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      /* translucent texture on the same tone color (not a moving sweep or a contrasting stripe) keeps this readable and consistent with the solid fill look */
      background: ${$indeterminate
        ? css`repeating-linear-gradient(
            135deg,
            rgb(255 255 255 / 18%) 25%,
            transparent 25%,
            transparent 50%,
            rgb(255 255 255 / 18%) 50%,
            rgb(255 255 255 / 18%) 75%,
            transparent 75%,
            transparent
          ),
            ${getToneColor($tone, theme)}`
        : getToneColor($tone, theme)};
      background-size: ${$indeterminate ? '1rem 1rem' : 'auto'};
      animation: ${$indeterminate ? css`${stripeDrift} 900ms linear infinite` : 'none'};

      &::after {
        animation: none;
        opacity: 0;
      }
    }
  `;
});

StyledProgressFill.defaultProps = defaultThemeProp;
