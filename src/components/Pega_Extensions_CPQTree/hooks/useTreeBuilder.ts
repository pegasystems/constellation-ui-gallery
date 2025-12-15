import { useCallback } from 'react';
import { type CustomTreeNode } from '../CustomTree.types';
import {
  generateNodeId,
  generateConfigNodeId,
  generateConfigFieldId,
  generateChildSpecId,
  generateConfigFieldIdFromItem,
  extractNodeLabel,
  extractNodeClass,
  extractWorkId,
  generateLinkURL,
  extractChildren,
  getMainChildSpec,
  extractProductOffer,
  buildPropertyPath,
  buildProductPropertyPaths,
  findAndRegisterPageLists,
} from '../utils';
import { PROPERTY_NAMES, NODE_TYPES, OBJECT_CLASSES, FLAG_PROPERTIES } from '../constants';

const MAX_DEPTH = 100;

/**
 * Custom hook that provides the tree building logic for CPQ tree data
 * Recursively builds tree nodes from the data structure
 */
export const useTreeBuilder = (
  childrenPropertyName: string | RegExp,
  displayPropertyName: string,
  idPropertyName: string,
  getPConnect: any,
) => {
  /**
   * Recursively builds tree nodes from data
   * @param item - The current item to process
   * @param cases - Array to collect built nodes into
   * @param caseInstanceKey - The case instance key for link generation
   * @param visitedItems - WeakSet to track visited items and prevent circular references
   * @param depth - Current depth in the tree
   * @param parentPath - Parent property path for building paths
   * @param treeIndex - Index in the Tree array (0-based)
   */
  const loadTree = useCallback(
    (
      item: any,
      cases: Array<CustomTreeNode>,
      caseInstanceKey: string,
      visitedItems: WeakSet<object> = new WeakSet(),
      depth: number = 0,
      parentPath: string = '',
      treeIndex: number = 0,
    ) => {
      if (depth > MAX_DEPTH || visitedItems.has(item)) {
        return;
      }

      const nodeId = generateNodeId(item, idPropertyName, treeIndex);
      visitedItems.add(item);

      // Build the current item's path
      const currentPath = buildPropertyPath(parentPath, treeIndex);

      const childcases: Array<CustomTreeNode> = [];

      // For product nodes, add configuration section as a child
      if (item[PROPERTY_NAMES.TYPE] === NODE_TYPES.PRODUCT) {
        processProductNode(item, currentPath, nodeId, childcases);
      }

      // Handle configurable children structure (for nested specs)
      const children = extractChildren(item, childrenPropertyName);
      const parentName = extractNodeLabel(item, displayPropertyName);

      if (children && Array.isArray(children) && children.length > 0) {
        processChildNodes(
          children,
          parentName,
          nodeId,
          currentPath,
          childcases,
          caseInstanceKey,
          visitedItems,
          depth,
          loadTree,
        );
      }

      const nodeLabel = extractNodeLabel(item, displayPropertyName);
      const nodeClass = extractNodeClass(item);
      const workId = extractWorkId(item, idPropertyName);
      const linkURL = generateLinkURL(nodeClass, workId, caseInstanceKey, nodeId);

      const node = {
        id: nodeId,
        label: nodeLabel,
        objclass: nodeClass,
        expanded: true,
        href: linkURL,
        itemData: item,
        ...(childcases.length > 0 ? { nodes: childcases } : null),
      };
      cases.push(node);
    },
    [childrenPropertyName, displayPropertyName, idPropertyName, getPConnect],
  );

  /**
   * Processes a product node to extract ProductOffer and build configuration structure
   */
  const processProductNode = (item: any, currentPath: string, nodeId: string, childcases: Array<CustomTreeNode>) => {
    // Extract ProductOffer from the item (handles both direct ProductOffer and Tree.ChildSpecification patterns)
    const productOffer = extractProductOffer(item);

    if (productOffer) {
      // Set ProductOffer on item and build property paths
      item[PROPERTY_NAMES.PRODUCT_OFFER] = productOffer;
      const productWithPaths = buildProductPropertyPaths(item, currentPath);
      const processedProductOffer = productWithPaths[PROPERTY_NAMES.PRODUCT_OFFER] || productOffer;

      // Register pagelists for PCore integration
      const productOfferPath = `${currentPath}.${PROPERTY_NAMES.PRODUCT_OFFER}`;
      findAndRegisterPageLists(processedProductOffer, productOfferPath, getPConnect);

      // Update item with processed ProductOffer (includes pxPropertyPath)
      item[PROPERTY_NAMES.PRODUCT_OFFER] = processedProductOffer;

      const mainChildSpec = getMainChildSpec(processedProductOffer);

      if (mainChildSpec) {
        const configNodeId = generateConfigNodeId(nodeId);
        const configLabel = mainChildSpec[PROPERTY_NAMES.SPEC_NAME] || 'Configuration';
        const configChildren: Array<CustomTreeNode> = [];

        // Add configuration items as nodes
        const configuration = mainChildSpec[PROPERTY_NAMES.CONFIGURATION] || [];
        configuration.forEach((configItem: any, index: number) => {
          const fieldName =
            configItem[PROPERTY_NAMES.FIELD_NAME] || configItem[PROPERTY_NAMES.NAME] || `Config-${index}`;
          const fieldId = generateConfigFieldId(configNodeId, index);
          configChildren.push({
            id: fieldId,
            label: fieldName,
            objclass: OBJECT_CLASSES.CONFIGURATION_FIELD,
            expanded: false,
            href: '',
            itemData: { ...configItem, [FLAG_PROPERTIES.IS_CONFIG_FIELD]: true },
          });
        });

        // Add child specifications as nodes
        const childSpecifications = mainChildSpec[PROPERTY_NAMES.CHILD_SPECIFICATIONS_LIST] || [];
        childSpecifications.forEach((childSpec: any, index: number) => {
          const specName = childSpec[PROPERTY_NAMES.SPEC_NAME] || childSpec[PROPERTY_NAMES.NAME] || `Spec-${index}`;
          const specId = generateChildSpecId(configNodeId, index);
          configChildren.push({
            id: specId,
            label: specName,
            objclass: OBJECT_CLASSES.CHILD_SPECIFICATION,
            expanded: false,
            href: '',
            itemData: { ...childSpec, [FLAG_PROPERTIES.IS_CHILD_SPEC]: true },
          });
        });

        // Add configuration node as a child of the product
        childcases.push({
          id: configNodeId,
          label: configLabel,
          objclass: OBJECT_CLASSES.CONFIGURATION,
          expanded: true,
          href: '',
          itemData: { ...mainChildSpec, [FLAG_PROPERTIES.IS_CONFIG_SECTION]: true },
          nodes: configChildren.length > 0 ? configChildren : undefined,
        });
      }
    }
  };

  /**
   * Processes child nodes recursively
   */
  const processChildNodes = (
    children: any[],
    parentName: string,
    nodeId: string,
    currentPath: string,
    childcases: Array<CustomTreeNode>,
    caseInstanceKey: string,
    visitedItems: WeakSet<object>,
    depth: number,
    loadTreeFn: typeof loadTree,
  ) => {
    children.forEach((childcase: any, childIndex: number) => {
      // Get the tree index for this child (convert to 0-based: if Index exists (1-based from Pega), subtract 1; otherwise use array index (0-based))
      const childTreeIndex = childcase[PROPERTY_NAMES.INDEX]
        ? parseInt(childcase[PROPERTY_NAMES.INDEX], 10) - 1
        : childIndex;

      // Skip if it's a product type (already handled above)
      if (childcase[PROPERTY_NAMES.TYPE] !== NODE_TYPES.PRODUCT) {
        // Check if this is a Configuration item (has FieldName property)
        if (
          childcase[PROPERTY_NAMES.FIELD_NAME] &&
          childcase[PROPERTY_NAMES.PX_OBJ_CLASS]?.includes(OBJECT_CLASSES.PRODUCT_CONFIG_ITEM)
        ) {
          // Handle Configuration items as leaf nodes
          const configFieldId = generateConfigFieldIdFromItem(nodeId, childcase);
          const configFieldLabel = childcase[PROPERTY_NAMES.FIELD_NAME] || 'Unknown Field';
          // Build path for configuration field
          const childPath = buildPropertyPath(currentPath, childTreeIndex);
          const configFieldPath = `${childPath}.${PROPERTY_NAMES.CONFIGURATION}.${configFieldLabel}`;
          // Set pxPropertyPath directly on the childcase object so it's available when accessed
          childcase[PROPERTY_NAMES.PX_PROPERTY_PATH] = configFieldPath;
          const configItemWithPath = {
            ...childcase,
            [FLAG_PROPERTIES.IS_CONFIG_FIELD]: true,
            [PROPERTY_NAMES.PX_PROPERTY_PATH]: configFieldPath,
          };
          childcases.push({
            id: configFieldId,
            label: configFieldLabel,
            objclass: childcase[PROPERTY_NAMES.PX_OBJ_CLASS] || OBJECT_CLASSES.CONFIGURATION_FIELD,
            expanded: false,
            href: '',
            itemData: configItemWithPath,
          });
        } else {
          // Check if child has the same name as parent and is not a product
          const childName = extractNodeLabel(childcase, displayPropertyName);
          const isDuplicateName =
            childName && parentName && childName.trim().toLowerCase() === parentName.trim().toLowerCase();

          if (isDuplicateName && childcase[PROPERTY_NAMES.TYPE] !== NODE_TYPES.PRODUCT) {
            // Skip the duplicate node and process its children directly
            processGrandchildren(
              childcase,
              nodeId,
              currentPath,
              childTreeIndex,
              childcases,
              caseInstanceKey,
              visitedItems,
              depth,
              loadTreeFn,
            );
          } else {
            // Regular tree node - process recursively
            const childPath = buildPropertyPath(currentPath, childTreeIndex);
            loadTreeFn(childcase, childcases, caseInstanceKey, visitedItems, depth + 1, childPath, childTreeIndex);
          }
        }
      }
    });
  };

  /**
   * Processes grandchildren when skipping duplicate named nodes
   */
  const processGrandchildren = (
    childcase: any,
    nodeId: string,
    currentPath: string,
    childTreeIndex: number,
    childcases: Array<CustomTreeNode>,
    caseInstanceKey: string,
    visitedItems: WeakSet<object>,
    depth: number,
    loadTreeFn: typeof loadTree,
  ) => {
    const childChildren = extractChildren(childcase, childrenPropertyName);
    if (childChildren && Array.isArray(childChildren) && childChildren.length > 0) {
      childChildren.forEach((grandchild: any, grandchildIndex: number) => {
        if (grandchild[PROPERTY_NAMES.TYPE] !== NODE_TYPES.PRODUCT) {
          // Convert to 0-based: if Index exists (1-based from Pega), subtract 1; otherwise use array index (0-based)
          const grandchildTreeIndex = grandchild[PROPERTY_NAMES.INDEX]
            ? parseInt(grandchild[PROPERTY_NAMES.INDEX], 10) - 1
            : grandchildIndex;
          if (
            grandchild[PROPERTY_NAMES.FIELD_NAME] &&
            grandchild[PROPERTY_NAMES.PX_OBJ_CLASS]?.includes(OBJECT_CLASSES.PRODUCT_CONFIG_ITEM)
          ) {
            const configFieldId = generateConfigFieldIdFromItem(nodeId, grandchild);
            const configFieldLabel = grandchild[PROPERTY_NAMES.FIELD_NAME] || 'Unknown Field';
            // Build path for nested configuration field
            const childPath = buildPropertyPath(currentPath, childTreeIndex);
            const grandchildPath = buildPropertyPath(childPath, grandchildTreeIndex);
            const configFieldPath = `${grandchildPath}.${PROPERTY_NAMES.CONFIGURATION}.${configFieldLabel}`;
            // Set pxPropertyPath directly on the grandchild object so it's available when accessed
            grandchild[PROPERTY_NAMES.PX_PROPERTY_PATH] = configFieldPath;
            const configItemWithPath = {
              ...grandchild,
              [FLAG_PROPERTIES.IS_CONFIG_FIELD]: true,
              [PROPERTY_NAMES.PX_PROPERTY_PATH]: configFieldPath,
            };
            childcases.push({
              id: configFieldId,
              label: configFieldLabel,
              objclass: grandchild[PROPERTY_NAMES.PX_OBJ_CLASS] || OBJECT_CLASSES.CONFIGURATION_FIELD,
              expanded: false,
              href: '',
              itemData: configItemWithPath,
            });
          } else {
            // Build path for nested grandchild
            const childPath = buildPropertyPath(currentPath, childTreeIndex);
            const grandchildPath = buildPropertyPath(childPath, grandchildTreeIndex);
            loadTreeFn(
              grandchild,
              childcases,
              caseInstanceKey,
              visitedItems,
              depth + 1,
              grandchildPath,
              grandchildTreeIndex,
            );
          }
        }
      });
    }
  };

  return { loadTree };
};
