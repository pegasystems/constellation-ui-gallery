import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyledCardContent = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    & > article {
      border: 0.0625rem solid ${theme.base.palette['border-line']};
      padding: 0.5rem;
      white-space: normal;
      background: ${theme.base.palette['primary-background']};
      margin-bottom: 0.25rem;
      height: 100%;
    }
    & dl:last-child {
      grid-template-columns: 1fr;
      gap: 0;
      padding-block-end: 0;
    }
    & dl:last-child > div,
    & dl:last-child > dd {
      padding-bottom: 0.5rem;
    }
  `;
});

export const MainCard = styled.div(({ rendering, minWidth }: { rendering: string; minWidth: string }) => {
  if (rendering === 'horizontal') {
    return css`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
      grid-gap: 1rem;
      grid-template-rows: repeat(1, 1fr);
      padding: 0 1rem 1rem;
    `;
  }
  return css`
    @media screen and (min-width: ${minWidth}) {
      column-count: 1;
    }
    @media screen and (min-width: ${`calc(2*${minWidth})`}) {
      column-count: 2;
    }
    @media screen and (min-width: ${`calc(3*${minWidth})`}) {
      column-count: 3;
    }
    @media screen and (min-width: ${`calc(4*${minWidth})`}) {
      column-count: 4;
    }
    @media screen and (min-width: ${`calc(5*${minWidth})`}) {
      column-count: 5;
    }
    column-gap: 1rem;
    padding: 0 1rem 1rem;
    & > div {
      margin: 0;
      display: inline-block;
      margin-bottom: 0.5rem;
      width: 100%;
    }
  `;
});
