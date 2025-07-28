import { meetsContrastGuidelines } from 'polished';
import styled, { css } from 'styled-components';

const TrendDisplayWrapper = styled.div(
  ({ colorValue, renderingMode }: { colorValue?: string; renderingMode: string }) => {
    if (renderingMode === 'badge' && colorValue && colorValue !== 'auto' && colorValue !== 'trend') {
      // Calculate the score for contrast - if pass, we will override the color of the primary button
      const scoreWhite = meetsContrastGuidelines(colorValue, '#FFF');
      return css`
        display: inline-flex;
        gap: 0.125rem;
        & > span {
          padding: 0.125rem 0.25rem;
          color: ${scoreWhite.AA ? '#fff' : '#000'};
          background-color: ${colorValue};
        }
      `;
    }
    return css`
      display: inline-flex;
      gap: 0.125rem;

      /* set color conditionally if set */
      ${colorValue && colorValue !== 'auto' && colorValue !== 'trend' ? `color: ${colorValue};` : ''}
    `;
  },
);

export default TrendDisplayWrapper;
