import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export default styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    & > div > div {
      max-width: unset;
    }

    & fieldset > div > div > div > div > div > div > div:last-child > div {
      display: flex;
      flex-flow: row wrap;
    }

    & fieldset > div h1 {
      display: none;
    }

    & fieldset {
      min-width: 40ch;
      flex: 1;
      border-right: 0.0625rem solid ${theme.base.palette['border-line']};
      margin-right: 1rem;
      padding-right: 1rem;
    }

    & fieldset dd {
      text-align: right;
    }

    & fieldset > legend > div {
      flex-direction: column;
    }

    & img {
      max-height: 12rem;
    }
  `;
});
