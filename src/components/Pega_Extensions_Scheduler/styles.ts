import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css, createGlobalStyle } from 'styled-components';

export const StyledCardContent = styled.div(() => {
  return css`
    background: red;
    height: 100%;
  `;
});

export const GlobalStyle = createGlobalStyle`
  :root {
    --fc-today-bg-color: none !important;
    --fc-event-border-color: none !important;
  }
`;

export const MainCard = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    border: 0.0625rem solid ${theme.base.palette['border-line']};
  `;
});
