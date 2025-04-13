import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { createGlobalStyle, css } from 'styled-components';

export const StyledTaskList = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    legend {
      margin-block-end: 0;
      padding-block-start: calc(0.75rem);
    }
    .task {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 0.0625rem solid ${theme.base.palette['border-line']};
      & > .name {
        vertical-align: center;
        flex: 1;
      }
      & > .status {
        padding-left: 0.5rem;
        text-align: right;
        vertical-align: center;

        & > span {
          background-color: #bbd4ea;
          display: inline-block;
          padding: 0.25rem 0.5rem;
          color: #0c2d4a;
          text-decoration: none;
          overflow-wrap: break-word;
        }
      }
    }
  `;
});

export const HideButtonsForm = createGlobalStyle`
 main article form  {
  & > div:last-child {
    display : none;
  }
}
`;
