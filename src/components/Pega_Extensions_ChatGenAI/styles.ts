import styled, { css } from 'styled-components';

export const StyledCardContent = styled.div(({ maxHeight }: { maxHeight: string }) => {
  return css`
    max-height: ${maxHeight};
    overflow-y: auto;
  `;
});

export const StyledGenAIComponent = styled.div``;
