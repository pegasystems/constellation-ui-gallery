import styled, { css } from 'styled-components';
import { themeDefinition } from '@pega/cosmos-react-core';

export default styled.article(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    background-color: ${theme.base.colors.white};
    border-radius: 0.25rem;
    width: 100%;
  `;
});
