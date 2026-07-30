import { defaultThemeProp, type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export const StyledFlexWrapper = styled.div(() => {
  return css`
    & > div > div {
      border: none;
      background: transparent;
      display: flex;
      flex-flow: row nowrap;
    }
  `;
});

export const StyledStarWrapper = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    color: ${theme.components.rating.color};
    display: inline-flex;
    .star {
      height: 2rem;
      width: 2rem;
      transition: all 0.2s ease-in-out;
      transform-origin: center;
    }
    .star:hover:not(.disabled):not(.readonly) {
      transform: scale(1.2);
    }
  `;
});
StyledStarWrapper.defaultProps = defaultThemeProp;

export const StyledStarRatingMetaInfo = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    padding-block: ${theme.base.spacing};
    margin-inline-start: ${theme.base.spacing};
  `;
});
StyledStarRatingMetaInfo.defaultProps = defaultThemeProp;
