import styled, { css } from 'styled-components';

export default styled.div(({ theme }) => {
  return css`
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    padding: 0.25rem;
    width: 100%;
    overflow: hidden;
    white-space: normal;
  `;
});
