import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    padding-top: 1rem;
    gap: 1rem;
    display: flex;
    flex-flow: column;

    & > button {
      width: fit-content;
    }
  `;
});
