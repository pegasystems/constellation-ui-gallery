import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20ch, 1fr));
    grid-gap: 1rem;
    grid-template-rows: repeat(1, 1fr);
    & > a {
      margin-inline-start: 0 !important;
    }
  `;
});
