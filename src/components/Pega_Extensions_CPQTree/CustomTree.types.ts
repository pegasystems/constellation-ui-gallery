import type { TreeNode } from '@pega/cosmos-react-core';

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
  /** URL or DOM id to navigate to. This will render the tree node as a link. */
  href: string;
  id: string;
  objclass: string;
  /** Full characteristic data for leaf nodes */
  characteristicData?: any;
  /** Full item data for any node */
  itemData?: any;
}
