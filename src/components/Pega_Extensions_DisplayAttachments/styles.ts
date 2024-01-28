import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyledCardContent = styled.button(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    padding: 0.5rem;
    min-height: 5rem;
    text-align: start;
    margin-inline-start: 0 !important;

    & > div > div {
      align-self: start;
    }
  `;
});

export const StyledHeading = styled.div(() => {
  return css`
    padding: 1rem 0;
  `;
});
