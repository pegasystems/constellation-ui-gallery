// utilizing theming, comment out, if want individual style
import styled, { css } from 'styled-components';
import { type themeDefinition } from '@pega/cosmos-react-core';

export const StyledCard = styled.article(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    background-color: ${theme.base.colors.white};
    border-radius: 0.25rem;
    width: 100%;
  `;
});
