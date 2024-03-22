import styled, { css } from 'styled-components';

export const SimpleContent = styled.div(() => {
  return css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20ch, 1fr));
    grid-gap: 1rem;
    grid-template-rows: repeat(1, 1fr);
    & a {
      margin-inline-start: 0 !important;
    }
  `;
});

export const GroupedContent = styled.div(() => {
  return css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30ch, 1fr));
    grid-gap: 1rem;
    grid-template-rows: repeat(1, 1fr);
    & a {
      margin-inline-start: 0 !important;
      padding-top: 0.5rem;
    }
  `;
});
