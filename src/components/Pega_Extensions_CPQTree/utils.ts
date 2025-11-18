/**
 * Utility functions for CPQ Tree component
 */

/**
 * Creates a regex from a pattern (handles both string and RegExp)
 * @param pattern - A string (regex pattern) or RegExp
 * @returns A new RegExp object
 */
export const createRegex = (pattern: string | RegExp): RegExp => {
  if (typeof pattern === 'string') {
    return new RegExp(pattern);
  }
  // Create a new RegExp from the existing one to avoid state issues
  return new RegExp(pattern.source, pattern.flags);
};

/**
 * Finds all properties matching a regex pattern and collects their arrays
 * @param obj - The object to search
 * @param pattern - A string (regex pattern) or RegExp to match property names
 * @returns An array of all items from matching properties that are arrays
 */
export const findMatchingChildren = (obj: any, pattern: string | RegExp | undefined): any[] => {
  if (!obj || !pattern) {
    return [];
  }

  const allChildren: any[] = [];

  // Iterate over all object keys
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Create a new regex for each test to avoid state issues
      const regex = createRegex(pattern);
      // Check if the key matches the regex pattern
      if (regex.test(key)) {
        const value = obj[key];
        // If the value is an array, add all its items
        if (Array.isArray(value)) {
          allChildren.push(...value);
        }
      }
    }
  }

  return allChildren;
};

/**
 * Generates a unique node ID from various possible sources
 * @param item - The item object to extract ID from
 * @param idPropertyName - The property name to use for ID extraction
 * @returns A unique node ID string
 */
export const generateNodeId = (item: any, idPropertyName: string = 'ProductID'): string => {
  return (
    item.pzInsKey ||
    item.ProductSpec?.[idPropertyName] ||
    item.ProductSpec?.pzInsKey ||
    item[idPropertyName] ||
    item.ParentID ||
    `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  );
};

/**
 * Generates a configuration section node ID
 * @param nodeId - The parent node ID
 * @returns A configuration section node ID
 */
export const generateConfigNodeId = (nodeId: string): string => {
  return `${nodeId}-config`;
};

/**
 * Generates a configuration field node ID
 * @param configNodeId - The configuration node ID
 * @param index - The field index
 * @returns A configuration field node ID
 */
export const generateConfigFieldId = (configNodeId: string, index: number): string => {
  return `${configNodeId}-field-${index}`;
};

/**
 * Generates a child specification node ID
 * @param configNodeId - The configuration node ID
 * @param index - The specification index
 * @returns A child specification node ID
 */
export const generateChildSpecId = (configNodeId: string, index: number): string => {
  return `${configNodeId}-spec-${index}`;
};

/**
 * Generates a configuration field ID from a configuration item
 * @param nodeId - The parent node ID
 * @param configItem - The configuration item
 * @returns A configuration field node ID
 */
export const generateConfigFieldIdFromItem = (nodeId: string, configItem: any): string => {
  return `${nodeId}-config-${configItem.FieldName}-${configItem.pyID || Date.now()}`;
};

/**
 * Extracts the display label from an item using various fallback options
 * @param item - The item object to extract label from
 * @param displayPropertyName - The property name to use for label extraction
 * @returns The display label string
 */
export const extractNodeLabel = (item: any, displayPropertyName: string = 'Name'): string => {
  return (
    item.pyLabel ||
    item.FieldName || // Handle Configuration items
    item.ProductSpec?.[displayPropertyName] ||
    item.ProductSpec?.Name ||
    item.ProductSpec?.Description ||
    item[displayPropertyName] ||
    item.Name ||
    item.SpecName || // Handle ChildSpecification items
    'Unknown Node'
  );
};

/**
 * Extracts the object class from an item
 * @param item - The item object to extract class from
 * @returns The object class string
 */
export const extractNodeClass = (item: any): string => {
  return item.pyClassName || item.ProductSpec?.pxObjClass || item.pxObjClass || 'Unknown';
};

/**
 * Extracts the work ID from an item
 * @param item - The item object to extract work ID from
 * @param idPropertyName - The property name to use for ID extraction
 * @returns The work ID string
 */
export const extractWorkId = (item: any, idPropertyName: string = 'ProductID'): string => {
  return item.pyID || item.ProductSpec?.[idPropertyName] || item[idPropertyName] || item.ParentID;
};

/**
 * Generates a semantic URL for opening work by handle
 * @param nodeClass - The case class name
 * @param workId - The work ID
 * @param caseInstanceKey - The current case instance key
 * @param nodeId - The node ID to check against caseInstanceKey
 * @returns The resolved semantic URL or empty string
 */
export const generateLinkURL = (nodeClass: string, workId: string, caseInstanceKey: string, nodeId: string): string => {
  if (caseInstanceKey === nodeId) {
    return '';
  }

  return (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: nodeClass },
    { workID: workId },
  );
};

/**
 * Finds the root tree array from a response object
 * @param response - The response object
 * @param childrenPropertyName - The property name or regex pattern to match
 * @returns The root tree array or null
 */
export const findRootTree = (response: any, childrenPropertyName?: string | RegExp): any[] | null => {
  if (!response) {
    return null;
  }

  let rootTree: any = null;

  if (childrenPropertyName) {
    if (typeof childrenPropertyName === 'string' || childrenPropertyName instanceof RegExp) {
      // Use regex pattern to find matching properties
      // Prefer "Tree" if it matches, otherwise use first matching property
      const regex = createRegex(childrenPropertyName);
      if (response.Tree && Array.isArray(response.Tree) && regex.test('Tree')) {
        rootTree = response.Tree;
      } else {
        // Find first matching property that is an array
        for (const key in response) {
          if (Object.prototype.hasOwnProperty.call(response, key)) {
            const testRegex = createRegex(childrenPropertyName);
            if (testRegex.test(key)) {
              const value = response[key];
              if (Array.isArray(value)) {
                rootTree = value;
                break;
              }
            }
          }
        }
      }
    } else {
      // Fallback to direct property access for backward compatibility
      rootTree = response[childrenPropertyName];
    }
  }

  // Fallback to standard properties if no root tree found via pattern
  if (!rootTree || !Array.isArray(rootTree)) {
    rootTree = response.Tree || response.pxResults;
  }

  return Array.isArray(rootTree) ? rootTree : null;
};

/**
 * Extracts children from an item using various methods
 * @param item - The item object to extract children from
 * @param childrenPropertyName - The property name or regex pattern to match
 * @returns An array of child items
 */
export const extractChildren = (item: any, childrenPropertyName?: string | RegExp): any[] => {
  if (!item) {
    return [];
  }

  let children: any[] = [];

  if (childrenPropertyName) {
    if (typeof childrenPropertyName === 'string' || childrenPropertyName instanceof RegExp) {
      // Use regex pattern to find matching properties
      children = findMatchingChildren(item, childrenPropertyName);
    } else {
      // Fallback to direct property access for backward compatibility
      const directChildren = item[childrenPropertyName];
      if (Array.isArray(directChildren)) {
        children = directChildren;
      }
    }
  }

  // Fallback to standard properties if no children found via pattern
  if (children.length === 0) {
    const fallbackChildren = item.pxResults || item.Tree;
    if (Array.isArray(fallbackChildren)) {
      children = fallbackChildren;
    }
  }

  return children;
};

/**
 * Extracts the configured field value from a configuration item
 * @param configItem - The configuration item
 * @returns The configured field value string
 */
export const extractConfiguredFieldValue = (configItem: any): string => {
  return configItem.ConfiguredFieldValue?.FieldValue || configItem.Value || '';
};

/**
 * Extracts the quantity from a child specification
 * @param childSpec - The child specification item
 * @returns The quantity string
 */
export const extractQuantity = (childSpec: any): string => {
  return childSpec.quantity || childSpec.Quantity || '0';
};

/**
 * Generates dropdown options from a field value list
 * @param fieldValueList - The field value list array
 * @returns An array of option objects with label and value
 */
export const generateFieldOptions = (fieldValueList: any[]): Array<{ label: string; value: string }> => {
  return fieldValueList.map((item: any) => ({
    label: item.FieldValue || item.label || item.value,
    value: item.FieldValue || item.value,
  }));
};

/**
 * Generates quantity dropdown options from 0 to maxCardinality
 * @param maxCardinality - The maximum cardinality value
 * @returns An array of option objects with label and value
 */
export const generateQuantityOptions = (maxCardinality: number): Array<{ label: string; value: string }> => {
  return Array.from({ length: maxCardinality + 1 }, (_, i) => ({
    label: i.toString(),
    value: i.toString(),
  }));
};

/**
 * Collects all Configuration arrays from nested ChildSpecificationsList items
 * @param specs - The specifications array to process
 * @returns An array of objects containing spec and config arrays
 */
export const collectConfigurations = (specs: any[]): Array<{ spec: any; config: any[] }> => {
  const allConfigurations: Array<{ spec: any; config: any[] }> = [];

  const processSpecs = (specList: any[]) => {
    specList.forEach((spec: any) => {
      if (spec.Configuration && Array.isArray(spec.Configuration) && spec.Configuration.length > 0) {
        allConfigurations.push({ spec, config: spec.Configuration });
      }
      // Recursively check nested ChildSpecificationsList
      if (spec.ChildSpecificationsList && Array.isArray(spec.ChildSpecificationsList)) {
        processSpecs(spec.ChildSpecificationsList);
      }
    });
  };

  processSpecs(specs);
  return allConfigurations;
};

/**
 * Finds the site node in a root tree array
 * @param rootTree - The root tree array
 * @returns The site node or null
 */
export const findSiteNode = (rootTree: any[]): any | null => {
  return rootTree.find((node: any) => node.Type === 'site' || node.ID === 'NoSite') || null;
};

/**
 * Extracts product ID from a product item
 * @param product - The product item
 * @param idPropertyName - The property name to use for ID extraction
 * @param fallbackId - A fallback ID to use if extraction fails
 * @returns The product ID string
 */
export const extractProductId = (product: any, idPropertyName: string = 'ProductID', fallbackId?: string): string => {
  return product.ID || product[idPropertyName] || fallbackId || `product-${Date.now()}`;
};

/**
 * Extracts product name from a product item
 * @param product - The product item
 * @param displayPropertyName - The property name to use for name extraction
 * @returns The product name string
 */
export const extractProductName = (product: any, displayPropertyName: string = 'Name'): string => {
  return product.Name || product[displayPropertyName] || 'Unknown Product';
};

/**
 * Gets the main child specification from a product offer
 * @param productOffer - The product offer object
 * @returns The main child specification or null
 */
export const getMainChildSpec = (productOffer: any): any | null => {
  const childSpecsList = productOffer?.ChildSpecificationsList || [];
  return childSpecsList.length > 0 ? childSpecsList[0] : null;
};

/**
 * Constants for tree traversal and styling
 */
export const TREE_CONSTANTS = {
  MAX_DEPTH: 100,
  DEPTH_INDENT: 24, // pixels per depth level
  FIELD_LABEL_WIDTH: '200px',
  FIELD_MAX_WIDTH: '200px',
  DEFAULT_MAX_CARDINALITY: 7,
} as const;

/**
 * Style constants for consistent styling
 */
export const STYLE_CONSTANTS = {
  BORDER_COLOR_LIGHT: '#f0f0f0',
  BORDER_COLOR_MEDIUM: '#e0e0e0',
  PADDING_VERTICAL: '4px',
  FIELD_LABEL_FLEX: '0 0 200px',
  FIELD_VALUE_FLEX: '1',
} as const;

/**
 * Toggles a value in a Set
 * @param set - The Set to toggle in
 * @param value - The value to toggle
 * @returns A new Set with the value toggled
 */
export const toggleSetValue = <T>(set: Set<T>, value: T): Set<T> => {
  const newSet = new Set(set);
  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    newSet.add(value);
  }
  return newSet;
};

/**
 * Creates a field configuration object for PConnect
 * @param type - The field type
 * @param value - The field value
 * @param options - Optional dropdown options
 * @returns A field configuration object
 */
export const createFieldConfig = (
  type: string,
  value: string,
  options?: Array<{ label: string; value: string }>,
): {
  type: string;
  label: string;
  value: string;
  displayMode: 'EDIT';
  options?: Array<{ label: string; value: string }>;
  onChange?: (newValue: string) => void;
} => {
  return {
    type,
    label: '',
    value,
    displayMode: 'EDIT' as const,
    ...(options && options.length > 0 ? { options } : {}),
  };
};

/**
 * Calculates padding left based on depth
 * @param depth - The depth level
 * @returns Padding left in pixels
 */
export const getDepthPadding = (depth: number): string => {
  return `${depth * TREE_CONSTANTS.DEPTH_INDENT}px`;
};
