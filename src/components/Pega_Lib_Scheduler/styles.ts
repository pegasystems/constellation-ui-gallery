import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css, createGlobalStyle } from 'styled-components';

export const StyledCardContent = styled.div(() => {
  return css`
    background: #cc0000;
    height: 100%;
    font-size: 1rem;
  `;
});

export const GlobalStyle = createGlobalStyle`
  :root {
    --fc-today-bg-color: none !important;
    --fc-event-border-color: none !important;
    --fc-event-bg-color: #2778C8 !important;
  }
`;

export const MainCard = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    border: 0.0625rem solid ${theme.base.palette['border-line']};
  `;
});
