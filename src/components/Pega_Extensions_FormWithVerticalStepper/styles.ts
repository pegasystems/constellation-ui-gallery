// individual style, comment out above, and uncomment here and add styles
import styled, { createGlobalStyle, css } from 'styled-components';
import { mix, rgba } from 'polished';

export default styled.div(() => {
  return css`
    margin: 0;
  `;
});

export const VerticalNavbarWrapper = styled.div`
  width: 25%;
`;

export const ActionButtonsWrapper = styled.div`
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
`;

export const Container = styled.div`
  flex-grow: 1;
`;

export const ProgressDetails = styled.div`
  padding-block: 0.625rem;
  border-bottom: 0.0625rem solid ${(props) => props.theme.base.palette['border-line']};
`;

export const ProgressTitle = styled.div`
  font-weight: 600;
`;

export const ProgressDescription = styled.div`
  color: ${(props) =>
    rgba(props.theme.base.palette['foreground-color'], props.theme.base.transparency['transparent-2'])};
`;

export const NavigationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const NavigationListItem = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.625rem;
  padding-left: 0.313rem;

  &:hover {
    background-color: ${(props) =>
      mix(0.85, props.theme.base.palette['primary-background'], props.theme.base.palette.interactive)};
  }
`;

export const NavigationItemTextContent = styled.div`
  flex-grow: 1;
  padding-block: 0.75rem;
  border-bottom: 0.0625rem solid ${(props) => props.theme.base.palette['border-line']};
`;

export const NavigationItemStatus = styled.div`
  font-size: 0.8rem;
  color: ${(props) =>
    rgba(props.theme.base.palette['foreground-color'], props.theme.base.transparency['transparent-2'])};
`;

export const NavigationItemTitle = styled.div<{ $status: string }>`
  font-weight: ${(props) => (props.$status === 'success' ? '600' : '400')};
`;

/* Global styles to hide Pega generated top navigation and action buttons */
export const HideTopNavigation = createGlobalStyle`
  main article form  {
    & > div:first-child > div:first-child {
      display : none;
    }

    & > div:first-child > div:nth-child(2) {
      grid-column: 1 / -1;
    }
  }
`;

export const HideActionButtons = createGlobalStyle`
  main article form  {
    & > div:last-child, & > div:nth-last-child(2) {
      display : none;
    }
  }
`;
