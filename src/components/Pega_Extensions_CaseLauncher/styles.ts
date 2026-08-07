import styled, { css } from 'styled-components';
import { defaultThemeProp } from '@pega/cosmos-react-core';
const StyledCard = styled.article(({ theme }) => {
  return css`
    background-color: ${theme.base.colors.white};
    border-radius: 0.25rem;
    width: 100%;
  `;
});

StyledCard.defaultProps = defaultThemeProp;
export default StyledCard;
