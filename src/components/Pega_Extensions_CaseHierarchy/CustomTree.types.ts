import type { MouseEvent, KeyboardEvent } from 'react';

import type { PropsWithDefaults, TreeProps, TreeNode } from '@pega/cosmos-react-core';

export interface CustomTreeNode extends TreeNode {
  /** A set of nested tree nodes. */
  nodes?: CustomTreeNode[];
  /** The display text of the tree node. */
  label: string;
  /**
   * If true, the node's children will be displayed.
   * @default false
   */
  expanded?: boolean;
  /** Click handler for the tree node. */
  onClick?: (id: TreeNode['id'], e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  /** URL or DOM id to navigate to. This will render the tree node as a link. */
  href: string;
  id: string;
  objclass: string;
}

export interface CustomTreeProps extends TreeProps<CustomTreeNode> {
  /** The id of the currently active tree node. */
  currentNodeId?: TreeNode['id'];
  getPConnect: any;
  /** Callback function for click events on tree nodes. This will only be called on parent nodes if selectableParents is true. It will always be called on leaf nodes. */
  onNodeClick?: (
    id: TreeNode['id'],
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => void;
  /** Callback function for toggling tree nodes between expanded/collapsed states. This is only ever called on parent nodes. */
  onNodeToggle?: (
    id: TreeNode['id'],
    e?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => void;
}

export interface CustomTreeContextProps extends CustomTreeProps {
  firstNodeId?: TreeNode['id'];
  lastNodeId?: TreeNode['id'];
  focusedNodeId?: TreeNode['id'];
  changeFocusedNodeId: (id: TreeNode['id'], type?: 'up' | 'down' | 'left' | 'right') => void;
  getPConnect: any;
}

export type CustomTreePropsWithDefaults = PropsWithDefaults<CustomTreeContextProps>;
