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

export const StyledStarWrapper = styled.div(({ theme }) => {
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
export const StyledStarRatingMetaInfo = styled.div((props) => {
  const { theme } = props;
  return css`
    padding-block: ${theme.base.spacing};
    margin-inline-start: ${theme.base.spacing};
  `;
});
