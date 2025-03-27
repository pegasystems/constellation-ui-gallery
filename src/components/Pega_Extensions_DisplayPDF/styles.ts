import styled, { css } from 'styled-components';

export default styled.ul(() => {
  return css`
    padding: 0;
    list-style-type: none;
    & > li {
      padding: 0.25rem 0;
    }
  `;
});
