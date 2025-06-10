import styled, { css } from 'styled-components';

export const StyledClearBtn = styled.div(({ hide }: { hide: boolean }) => {
  if (hide) {
    return css`
      display: none;
    `;
  }
});

export const StyledPegaExtensionsMap = styled.div(({ height }: { height: string }) => {
  return css`
    height: ${height};
    width: 100%;
  `;
});
