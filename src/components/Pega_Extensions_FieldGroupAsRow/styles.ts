import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export default styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    & > div > div > div > div:last-child > div {
      display: flex;
      flex-flow: row wrap;
    }

    & h1 {
      display: none;
    }

    & > div > div > div > div:last-child > div > div {
      min-width: 38ch;
      flex: 1;
      border-right: 0.0625rem solid ${theme.base.palette['border-line']};
      margin-right: 0.5rem;
      padding-right: 0.5rem;
    }

    & div > div:last-child {
      padding-inline-start: 0;
    }

    & div > div:last-child::before {
      content: none;
    }

    & img {
      max-height: 12rem;
    }
  `;
});
