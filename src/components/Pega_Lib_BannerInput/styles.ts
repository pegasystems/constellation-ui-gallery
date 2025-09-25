import { tryCatch } from '@pega/cosmos-react-core';
import { getContrast, readableColor } from 'polished';
import styled, { css } from 'styled-components';

export const StyledBanner = styled.div(({ theme }) => {
  return css`
    border-radius: ${theme.components.card['border-radius']};
    min-height: 3.5rem;
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr);
  `;
});

export const StyledBannerStatus = styled.div(({ variant, theme }: { variant: string; theme: any }) => {
  const background = theme.base.palette[variant];
  const color = tryCatch(() =>
    getContrast(background, theme.base.palette['primary-background']) >= 3
      ? theme.base.palette['primary-background']
      : readableColor(background),
  );

  return css`
    background-color: ${background};
    color: ${color};
    border: 0.0625rem solid ${background};
    border-inline-end: none;
    border-start-start-radius: inherit;
    border-end-start-radius: inherit;
    font-size: 1.25rem;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
});
export const StyledBannerText = styled.div(({ variant, theme }: { variant: string; theme: any }) => {
  const background = theme.base.palette['primary-background'];
  const color = readableColor(background);
  return css`
    background: ${background};
    padding-block: 0.5rem;
    padding-inline-start: 0.5rem;
    padding-inline-end: 0.5rem;
    border: 0.0625rem solid ${theme.base.palette[variant]};
    border-inline-start: none;
    border-start-end-radius: inherit;
    border-end-end-radius: inherit;
    display: flex;
    align-items: center;
    color: ${color};
  `;
});
