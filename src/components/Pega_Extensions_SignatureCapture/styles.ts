import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyledSignatureContent = styled.div(() => {
  return css`
    & button {
      border-radius: 0;
      border-bottom: none;
      padding: 0.25rem 0.5rem;
    }
  `;
});

export const StyledSignatureReadOnlyContent = styled.div(
  ({ theme }: { theme: typeof themeDefinition }) => {
    return css`
      max-width: 40ch;
      border: 0.0625rem solid ${theme.base.palette['border-line']};
    `;
  }
);
