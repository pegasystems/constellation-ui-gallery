import styled, { createGlobalStyle, css } from 'styled-components';

export const MainContent = styled.div(() => {
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

/* This is a temporary workaround when using Constellation DX component - the popover div
  is outside the modal popover and does not have the correct z-index */
export const FixPopover = createGlobalStyle`
    body > div[data-popper-placement="bottom-start"] {
      z-index: 7000!important;
    }
`;
