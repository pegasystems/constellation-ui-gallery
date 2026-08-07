import styled, { css } from 'styled-components';

export const StyledClearBtn = styled.div<{ hide: boolean }>(({ hide }) => {
  if (hide) {
    return css`
      display: none;
    `;
  }
});

export const StyledPegaExtensionsMap = styled.div<{ height: string }>(({ height }) => {
  return css`
    height: ${height};
    width: 100%;
  `;
});
