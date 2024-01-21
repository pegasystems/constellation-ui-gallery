import styled, { css } from 'styled-components';

export const StyledCardContent = styled.div(({ maxHeight }: { maxHeight: string }) => {
  return css`
    max-height: ${maxHeight};
    overflow-y: auto;
  `;
});

export const StyledGenAIComponent = styled.div(() => {
  return css`
    & svg {
      display: block;
      fill: currentColor;
      height: 1.125rem;
      width: 1.125rem;
      vertical-align: middle;
      flex-shrink: 0;
    }
  `;
});
