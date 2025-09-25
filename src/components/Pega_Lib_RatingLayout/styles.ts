import styled, { css } from 'styled-components';

export default styled.div(({ minWidth }: { minWidth: string }) => {
  return css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${minWidth}, 1fr));
    grid-gap: 1rem;
    padding-top: 1rem;
  `;
});
