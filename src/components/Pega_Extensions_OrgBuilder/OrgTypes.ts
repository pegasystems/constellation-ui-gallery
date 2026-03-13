export type NodeType =
  | 'corporation'
  | 'division'
  | 'department'
  | 'factory'
  | 'team'
  | 'company'
  | 'section'
  | 'group'
  | 'position';

export interface OrgNode {
  id: string;
  name: string;
  shortName: string;
  type: NodeType;
  postId?: string;
  children: OrgNode[];
}

/** Hex background color for rectangular nodes (for styled-components) */
export const getNodeColorHex = (type: NodeType): string => {
  switch (type) {
    case 'corporation':
      return '#047857';
    case 'division':
      return '#059669';
    case 'department':
    case 'factory':
    case 'company':
    case 'section':
    case 'group':
    case 'team':
      return '#10b981';
    case 'position':
      return '#059669';
    default:
      return '#10b981';
  }
};

export const getNodeShape = (type: NodeType): 'rectangle' | 'triangle' => {
  return type === 'position' ? 'triangle' : 'rectangle';
};

// Deep clone a node and all its children with new IDs
export const cloneNodeWithNewIds = (node: OrgNode, prefix: string = ''): OrgNode => {
  const newId = `${prefix}${node.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return {
    ...node,
    id: newId,
    children: node.children.map((child) => cloneNodeWithNewIds(child, prefix)),
  };
};

// Find a node by id in the tree (returns the node from the tree, not a copy)
export function getNodeById(root: OrgNode, id: string): OrgNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = getNodeById(child, id);
    if (found) return found;
  }
  return undefined;
}

/** Data page response shape for Organization Builder. The DP must return these two trees. */
export interface OrgBuilderDataPageResponse {
  /** Reference organization tree (read-only source for drag) */
  pyReferenceOrganization: OrgNode;
  /** Initial target organization tree (editable copy) */
  pyTargetOrganization: OrgNode;
}
