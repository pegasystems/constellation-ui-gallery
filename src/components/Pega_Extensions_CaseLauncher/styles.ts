import styled, { css } from 'styled-components';
import { themeDefinition } from '@pega/cosmos-react-core';

const StyledCard = styled.article(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    background-color: ${theme.base.colors.white};
    border-radius: 0.25rem;
    width: 100%;
  `;
});
export default StyledCard;
