import styled, { css } from 'styled-components';
import { transparentize } from 'polished';

import { Tree, StyledTreeListItem, Icon, StyledIcon, defaultThemeProp, useDirection } from '@pega/cosmos-react-core';

export const StyledToggleIcon = styled(Icon)``;

export const StyledLabelContent = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline;
`;

export const StyledCustomTreeItemSubTree = styled.div(() => {
  return css`
    position: relative;
  `;
});

StyledCustomTreeItemSubTree.defaultProps = defaultThemeProp;

export const StyledNodeInteraction = styled.div(({ theme }) => {
  return css`
    color: ${theme.base.palette['foreground-color']};
    text-decoration: none;
    min-height: 2.25rem;
    padding-inline-start: calc(var(--parent-caret-width) * var(--depth) + var(--initial-padding));
    padding-inline-end: calc(var(--initial-padding) + ${theme.base.spacing});
    cursor: pointer;

    &:focus-visible {
      outline: none;
    }

    &:hover {
      background-color: ${transparentize(0.9, theme.base.palette['foreground-color'])};
    }

    &[aria-current='page'],
    &[aria-current='true'] {
      background-color: ${transparentize(0.95, theme.base.palette['foreground-color'])};

      & > ${StyledLabelContent}, & > :first-child > ${StyledLabelContent} {
        color: ${theme.base.palette.interactive};
      }
    }
  `;
});

StyledNodeInteraction.defaultProps = defaultThemeProp;

export const StyledCustomTreeLeaf = styled.div(() => {
  return css`
    ${StyledNodeInteraction} {
      padding-inline-start: calc(
        var(--initial-padding) + (var(--parent-caret-width) * var(--depth)) +
          (var(--parent-caret-spacing-width) * (max(var(--has-parent-sibling), var(--has-parent))))
      );
    }
  `;
});

StyledCustomTreeLeaf.defaultProps = defaultThemeProp;

export const StyledCustomTreeParent: any = styled(StyledNodeInteraction)(({ theme }) => {
  const { ltr } = useDirection();

  return css`
    display: flex;
    align-items: center;
    min-height: 2rem;
    &[aria-expanded='true'] ${StyledToggleIcon} {
      transform: rotate(90deg);
    }

    &[aria-expanded='false'] {
      ${StyledToggleIcon} {
        transform: rotate(${ltr ? '0' : '180'}deg);
      }

      + ${StyledCustomTreeItemSubTree} {
        display: none;
      }
    }

    &:hover + ${StyledCustomTreeItemSubTree}::before {
      opacity: 0.5;
    }

    ${StyledToggleIcon} {
      transition: transform calc(${theme.base.animation.speed} / 2) ${theme.base.animation.timing.ease};
    }
  `;
});

StyledCustomTreeParent.defaultProps = defaultThemeProp;

export const StyledCustomTreeNode = styled.div(
  ({ theme }) => css`
    --initial-padding: calc(${theme.base.spacing} * 0.5);
    --parent-caret-width: 1em;
    --parent-caret-spacing-width: max(
      (var(--parent-caret-width) + (2 * ${theme.components.button['border-width']})),
      ${theme.base['hit-area'].compact}
    );

    ${StyledIcon} {
      width: var(--parent-caret-width);
      height: var(--parent-caret-width);
    }
  `,
);

StyledCustomTreeNode.defaultProps = defaultThemeProp;

export const StyledCustomTree = styled(Tree)(() => {
  return css`
    ${StyledTreeListItem} {
      display: block;
    }
  `;
});

StyledCustomTree.defaultProps = defaultThemeProp;

(StyledCustomTree as typeof Tree & { defaultProps: object }).defaultProps = defaultThemeProp;
