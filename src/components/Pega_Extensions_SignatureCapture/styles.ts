import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    & button {
      border-radius: 0;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-bottom: none;
      color: #000;
      padding: 0.25rem 0.5rem;
    }

    & button:first-child {
      border-left: none;
    }

    & button:last-child {
      margin-left: auto;
      border-right: none;
    }
  `;
});
