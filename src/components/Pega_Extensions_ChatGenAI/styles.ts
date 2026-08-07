import styled, { css } from 'styled-components';

export const StyledCardContent = styled.div<{ maxHeight: string }>(({ maxHeight }) => {
  return css`
    max-height: ${maxHeight};
    overflow-y: auto;
  `;
});

export const StyledGenAIComponent = styled.div``;
