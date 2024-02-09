import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export default styled.button(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    padding: 0.5rem;
    min-height: 5rem;
    text-align: start;
    margin-inline-start: 0 !important;
    background: ${theme.base.palette['primary-background']};
    & > div {
      height: 100%;
    }
    & > div > div {
      align-self: start;
    }
  `;
});
