import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    & > div > div {
      max-width: unset;
    }

    & > div > div > div {
      display: flex;
      flex-flow: row wrap;
    }

    & > div > div > div > h3 {
      display: none;
    }

    & fieldset {
      min-width: 40ch;
      flex: 1;
      border-right: 0.0625rem solid rgb(207, 207, 207);
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
      max-height: 200px;
    }
  `;
});
