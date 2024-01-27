import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    & button {
      border-radius: 0;
      border-bottom: none;
      padding: 0.25rem 0.5rem;
    }
  `;
});
