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

export const MainCard = styled.div(({ height }: { height: string }) => {
  return css`
    min-height: ${height};
    display: flex;
    flex-flow: row nowrap;
    gap: 0.5rem;
    padding: 0 0.5rem 0.5rem;
  `;
});

export const StyledColumn = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    display: flex;
    flex-flow: column;
    flex: 1;
    background: ${theme.base.palette['app-background']};
    padding: 0.25rem;

    & > h2 {
      text-align: center;
      padding: 1rem 0;
    }
    & > div {
      display: flex;
      flex-flow: column;
      min-height: 10rem;
    }
  `;
});
