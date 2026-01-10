// individual style, comment out above, and uncomment here and add styles
import { mix, rgba } from 'polished';
import { tryCatch, type themeDefinition } from '@pega/cosmos-react-core';
import styled, { createGlobalStyle, css } from 'styled-components';

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

export const ProgressDetails = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    padding-block: 0.625rem;
    border-bottom: 0.0625rem solid ${theme.base.palette['border-line']};
  `;
});

export const ProgressTitle = styled.div`
  font-weight: 600;
`;

export const ProgressDescription = styled.div(
  ({
    theme: {
      base: {
        palette: { 'foreground-color': fgColor },
        transparency: { 'transparent-2': transparency },
      },
    },
  }) => {
    const color = tryCatch(() => rgba(fgColor, transparency));

    return css`
      color: ${color};
    `;
  },
);

export const NavigationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const NavigationListItem = styled.li(
  ({
    theme: {
      base: {
        palette: { 'primary-background': bgColor, interactive: fgColor },
      },
    },
  }) => {
    const hoverBgColor = tryCatch(() => mix(0.85, fgColor, bgColor));

    return css`
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.625rem;
      padding-left: 0.313rem;

      &:hover {
        background-color: ${hoverBgColor};
      }
    `;
  },
);

export const NavigationItemTextContent = styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    flex-grow: 1;
    padding-block: 0.75rem;
    border-bottom: 0.0625rem solid ${theme.base.palette['border-line']};
  `;
});

export const NavigationItemStatus = styled.div(
  ({
    theme: {
      base: {
        palette: { 'foreground-color': fgColor },
        transparency: { 'transparent-2': transparency },
      },
    },
  }) => {
    const color = tryCatch(() => rgba(fgColor, transparency));

    return css`
      font-size: 0.8rem;
      color: ${color};
    `;
  },
);

export const NavigationItemTitle = styled.div(({ $status }: { $status: string }) => {
  const fontWeight = $status === 'current' ? 600 : 400;

  return css`
    font-weight: ${fontWeight};
  `;
});

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
